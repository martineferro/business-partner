const BusinessPartnerCapabilityApi = require('../api/BusinessPartnerCapability');

class BusinessPartnerCapability {
  constructor(app, db) {
    this.app = app;
    this.api = new BusinessPartnerCapabilityApi(db);
  }

  init() {
    this.app.post('/api/suppliers/:businessPartnerId/capabilities/:capabilityId', (req, res) => this.create(req, res));
    this.app.post('/api/customers/:businessPartnerId/capabilities/:capabilityId', (req, res) => this.create(req, res));
    this.app.post('/api/business-partners/:businessPartnerId/capabilities/:capabilityId', (req, res) => this.create(req, res));

    this.app.delete('/api/suppliers/:businessPartnerId/capabilities/:capabilityId', (req, res) => this.delete(req, res));
    this.app.delete('/api/customers/:businessPartnerId/capabilities/:capabilityId', (req, res) => this.delete(req, res));
    this.app.delete('/api/business-partners/:businessPartnerId/capabilities/:capabilityId', (req, res) => this.delete(req, res));
  }

  create(req, res) {
    const createdBy = req.opuscapita.userData('id') || 'a_svc_user';
    return this.api.create(req.params.businessPartnerId, req.params.capabilityId, createdBy).
      then(capability => res.json(capability)).catch(error => {
        req.opuscapita.logger.error('Error when creating Capability: %s', error.message);
        return res.status('400').json({ message: error.message })
      });
  }

  delete(req, res) {
    return this.api.delete(req.params.businessPartnerId, req.params.capabilityId).then(() => res.json(null)).
      catch(error => {
        req.opuscapita.logger.error('Error when deleting Capability: %s', error.message);
        return res.status('400').json({ message: error.message })
      });
  }
};

module.exports = BusinessPartnerCapability;
