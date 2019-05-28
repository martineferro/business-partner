const UserData = require('../services/UserData');

class DataMigration {
  constructor(app, db) {
    this.app = app;
    this.db = db;
  }

  init() {
    this.app.get('/api/migrateData', (req, res) => this.migrate(req, res));
  }

  async migrate(req, res) {
    const serviceClient = req.opuscapita.serviceClient;

    try {
      const [suppliers, customers, businessLinks] = await Promise.all([
        serviceClient.get('supplier', '/api/suppliers').spread(sups => sups),
        serviceClient.get('customer', '/api/customers').spread(cus => cus),
        serviceClient.get('business-link', '/api/business-links').spread(blks => blks)
      ]);

      let businessPartners = suppliers.map(supplier => {
        const { subEntityCode, role, status, rejectionReason, ...busPartner } = supplier;

        return { ...busPartner, statusId: status, entityCode: subEntityCode, isSupplier: true };
      });

      businessPartners.concat(customers.map(customer => {
        const { subEntityCode, status, rejectionReason, ...busPartner } = customer;

        return { ...busPartner, statusId: status, entityCode: subEntityCode, isCustomer: true };
      }));

      await this.db.models.BusinessPartner.bulkCreate(businessPartners, { ignoreDuplicates: true });

      const userData = new UserData(req);
      for (let bl of businessLinks) {
        const connections = bl.connections;
        delete bl.connections;

        bl.createdBy = userData.id;
        bl.changedBy = userData.id;
        let { id, supplierId, customerId, ...defaults } = bl;
        const businessLink = await this.db.models.BusinessLink.findOrCreate({ where: { supplierId, customerId }, defaults: defaults }).spread((link, created) => link);

        await Promise.all(connections.map(connection => {
          connection.createdBy = userData.id;
          connection.changedBy = userData.id;

          const { id, businessLinkId, type, ...otherAttributes } = connection
          const attributes = { businessLinkId: businessLink.id, type };

          return this.db.models.BusinessLinkConnection.findOrCreate({ where: attributes, defaults: otherAttributes }).spread((conn, created) => conn);
        }));
      }

      return res.json({ message: 'Migration complete' });
    } catch(error) {
      return res.status('404').json({ message : error.message });
    }
  }
};

module.exports = DataMigration;
