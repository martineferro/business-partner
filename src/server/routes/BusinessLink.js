const BusinessLinkApi = require('../api/BusinessLink');
const BusinessLinkConnectionApi = require('../api/BusinessLinkConnection');
const UserData = require('../services/UserData');

class BusinessLink {
  constructor(app, db) {
    this.app = app;
    this.api = new BusinessLinkApi(db);
    this.blcApi = new BusinessLinkConnectionApi(db);
  }

  init() {
    this.app.get('/api/business-links', (req, res) => this.index(req, res));
    this.app.post('/api/business-links', (req, res) => this.create(req, res));
    this.app.put('/api/business-links/:id', (req, res) => this.update(req, res));
    this.app.get('/api/suppliers/:supplierId/business-links', (req, res) => this.index(req, res));
    this.app.get('/api/suppliers/:supplierId/customers/:customerId/business-links', (req, res) => this.index(req, res));
    this.app.get('/api/customers/:customerId/business-links', (req, res) => this.index(req, res));
    this.app.put('/api/suppliers/:supplierId/business-links', (req, res) => this.create(req, res));
    this.app.put('/api/suppliers/:supplierId/business-link-connections/:connectionId', (req, res) => this.updateBLConnection(req, res));
    this.app.put('/api/customers/:customerId/business-link-connections/:connectionId', (req, res) => this.updateBLConnection(req, res));
  }

  index(req, res) {
    let query = {};
    if (req.params.supplierId) query.supplierId = req.params.supplierId;
    if (req.params.customerId) query.customerId = req.params.customerId;
    if (req.query.id) query.id = req.query.id;
    if (req.query.supplierIds) query.supplierIds = req.query.supplierIds;

    const includes = req.query.include ? req.query.include.split(',') : [];

    return this.api.all(query, includes).then(businessLinks => res.json(businessLinks));
  }

  create(req, res) {
    return this.createBusinessLinkAndConnections(req).then(businessLink => {
      return res.status('201').json(businessLink);
    }).catch(error => {
      req.opuscapita.logger.error('Error when creating BusinessLink: %s', error.message);
      return res.status('400').json({ message : error.message });
    });
  }

  async update(req, res) {
    const exists = await this.api.exists(req.params.id);

    if (!exists) return res.status('404').json({message: 'A business link with this ID does not exist.'});

    return this.updateBusinessLinkAndConnections(req).then(businessLink => {
      return res.status('200').json(businessLink);
    }).catch(error => {
      req.opuscapita.logger.error('Error when creating BusinessLink: %s', error.message);
      return res.status('400').json({ message : error.message });
    });
  }

  async updateBLConnection(req, res) {
    const connectionId = req.params.connectionId;

    if (connectionId != req.body.id) {
      const message = 'Inconsistent data';
      req.opuscapita.logger.error('Error when updating BusinessLinkConnection: %s', message);
      return res.status('422').json({ message: message });
    }

    const exists = await this.blcApi.exists(connectionId);

    if (!exists) return res.status('404').json({message: 'A business link connection with this ID does not exist.'});

    return this.updateConnection(connectionId, { status: req.body.status }).then(async connection => {
      const businessLink = await this.api.find(connection.businessLinkId);

      req.opuscapita.logger.info(`Sending business-link event with topic updated and payload: ${getPayloadInfo(businessLink)}`);
      return req.opuscapita.eventClient.emit('business-link.business-link.updated', businessLink).then(() => {
        return res.json(connection);
      });
    }).catch(error => {
      req.opuscapita.logger.error('Error when updating BusinessLinkConnection: %s', error.message);
      return res.status('400').json({ message : error.message });
    });
  }

  async createBusinessLinkAndConnections(req) {
    const userData = new UserData(req);
    let data = req.body;
    data.createdBy = userData.id;
    data.changedBy = userData.id;
    const connections = data.connections;
    delete data.connections;

    return this.createBusinessLink(data).then(async businessLink => {
      const businessLinkId = businessLink.id;
      const createdConnections = await Promise.all(connections.map(connection => {
        connection.createdBy = userData.id;
        connection.changedBy = userData.id;
        return this.createConnection(businessLinkId, connection)
      }));

      businessLink.dataValues.connections = createdConnections;
      delete businessLink.dataValues.BusinessLinkConnections

      req.opuscapita.logger.info(`Sending business-link event with topic created and payload: ${businessLink.dataValues}`);
      await req.opuscapita.eventClient.emit('business-link.business-link.created', businessLink.dataValues);
      return businessLink.dataValues;
    });
  }

  async updateBusinessLinkAndConnections(req) {
    const userData = new UserData(req);
    let data = req.body;
    data.changedBy = userData.id;
    const connectionsByType = data.connections.reduce((acc, con) => { acc[con.type] = con; return acc }, {});
    delete data.connections;

    let businessLink = await this.updateBusinessLink(req.params.id, data);

    const connectionsByAction = businessLink.connections.reduce((acc, conn) => {
      if (connectionsByType[conn.type]) {
        acc['update'].push(conn);
      } else {
        acc['delete'].push(conn.id);
      }

      return acc;
    }, { delete: [], update: [] });

    if (connectionsByAction['delete'].length > 0) {
      await this.blcApi.delete({ ids: connectionsByAction['delete'] });
    }

    businessLink.connections = await Promise.all(connectionsByAction['update'].map(con => {
      connectionsByType[con.type].changedBy = userData.id;
      return this.updateConnection(con.id, connectionsByType[con.type])
    }));


    // Create connections that are not available
    if (businessLink.connections.length < Object.values(connectionsByType).length) {
      const availableTypes = businessLink.connections.map(conn => conn.type);
      for (const typ of Object.keys(connectionsByType)) {
        if (availableTypes.includes(typ)) continue;

        connectionsByType[typ].createdBy = userData.id;
        connectionsByType[typ].changedBy = userData.id;
        const connection = await this.createConnection(businessLink.id, connectionsByType[typ]);
        businessLink.connections.push(connection);
      }
    }

    req.opuscapita.logger.info(`Sending business-link event with topic updated and payload: ${businessLink}`);
    await req.opuscapita.eventClient.emit('business-link.business-link.updated', businessLink);
    return businessLink;
  }

  createBusinessLink(attributes) {
    return this.api.create(attributes).catch(error => {
      const errorMessage = error.message;
      throw new Error(errorMessage);
    });
  }

  updateBusinessLink(id, attributes) {
    return this.api.update(id, attributes).catch(error => {
      const errorMessage = error.message;
      throw new Error(errorMessage);
    });
  }

  createConnection(businessLinkId, connectionAttributes) {
    return this.blcApi.create(businessLinkId, connectionAttributes).catch(error => {
      const errorMessage = error.message;
      throw new Error(errorMessage);
    });
  }

  updateConnection(connectionId, connection) {
    return this.blcApi.update(connectionId, connection).catch(error => {
      const errorMessage = error.message;
      throw new Error(errorMessage);
    });
  }
};

let getPayloadInfo = function(payload)
{
  return `{ supplierId: ${payload.supplierId}, customerId: ${payload.customerId} }`;
}

module.exports = BusinessLink;
