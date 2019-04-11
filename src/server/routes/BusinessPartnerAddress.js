const BusinessPartnerAddressApi = require('../api/BusinessPartnerAddress');
const UserData = require('../services/UserData');

class BusinessPartnerAddress {
  constructor(app, db) {
    this.app = app;
    this.api = new BusinessPartnerAddressApi(db);
  }

  init() {
    this.app.get('/api/suppliers/:businessPartnerId/addresses', (req, res) => this.index(req, res));
    this.app.get('/api/customers/:businessPartnerId/addresses', (req, res) => this.index(req, res));
    this.app.get('/api/business-partners/:businessPartnerId/addresses', (req, res) => this.index(req, res));

    this.app.post('/api/suppliers/:businessPartnerId/addresses', (req, res) => this.create(req, res));
    this.app.post('/api/customers/:businessPartnerId/addresses', (req, res) => this.create(req, res));
    this.app.post('/api/business-partners/:businessPartnerId/addresses', (req, res) => this.create(req, res));

    this.app.get('/api/suppliers/:businessPartnerId/addresses/:addressId', (req, res) => this.show(req, res));
    this.app.get('/api/customers/:businessPartnerId/addresses/:addressId', (req, res) => this.show(req, res));
    this.app.get('/api/business-partners/:businessPartnerId/addresses/:addressId', (req, res) => this.show(req, res));

    this.app.put('/api/suppliers/:businessPartnerId/addresses/:addressId', (req, res) => this.update(req, res));
    this.app.put('/api/customers/:businessPartnerId/addresses/:addressId', (req, res) => this.update(req, res));
    this.app.put('/api/business-partners/:businessPartnerId/addresses/:addressId', (req, res) => this.update(req, res));

    this.app.delete('/api/suppliers/:businessPartnerId/addresses/:addressId', (req, res) => this.delete(req, res));
    this.app.delete('/api/customers/:businessPartnerId/addresses/:addressId', (req, res) => this.delete(req, res));
    this.app.delete('/api/business-partners/:businessPartnerId/addresses/:addressId', (req, res) => this.delete(req, res));
  }

  index(req, res) {
    return this.api.all(req.params.businessPartnerId).then(addresses => res.json(addresses));
  }

  show(req, res) {
    return this.api.find(req.params.businessPartnerId, req.params.addressId).then(address => {
      if (!address) return res.status('404').json({ message: `Address doen't exist` });

      return res.json(address)
    });
  }

  async create(req, res) {
    const userData = new UserData(req);
    req.body.businessPartnerId = req.params.businessPartnerId;
    req.body.createdBy = userData.id;
    req.body.changedBy = userData.id;

    try {
      const address = await this.api.create(req.body);
      return res.status('201').json(address);
    } catch(error) {
      req.opuscapita.logger.error('Error when creating BusinessPartnerAddress: %s', error.message);
      return res.status('400').json({ message : error.message });
    }
  }

  async update(req, res) {
    const userData = new UserData(req);
    const businessPartnerId = req.params.businessPartnerId;

    try {
      const exists = await this.api.exists(businessPartnerId, req.params.addressId);
      if (exists) {
        req.body.changedBy = userData.id;
        const address = await this.api.update(businessPartnerId, req.params.addressId, req.body);
        return res.json(address);
      }

      const message = 'A supplier address with this ID does not exist.'
      req.opuscapita.logger.error('Error when updating BusinessPartnerAddress: %s', message);
      return res.status('404').json({ message : message });
    } catch(error) {
      req.opuscapita.logger.error('Error when updating BusinessPartnerAddress: %s', error.message);
      return res.status('400').json({ message : error.message });
    }
  }

  async delete(req, res) {
    await this.api.delete(req.params.businessPartnerId, req.params.addressId).catch(error => {
      req.opuscapita.logger.error('Error when deleting BusinessPartnerAddress: %s', error.message);
      return res.status('400').json({ message : error.message });
    });

    return res.json(null);
  }
};

module.exports = BusinessPartnerAddress;
