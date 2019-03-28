const BusinessPartnerApi = require('../api/BusinessPartner');

class BusinessPartnerOrganization {
  constructor(app, db) {
    this.app = app;
    this.api = new BusinessPartnerApi(db);
  }

  init() {
    this.app.get('/api/suppliers/:businessPartnerId/organization', (req, res) => this.organization(req, res));
    this.app.get('/api/customers/:businessPartnerId/organization', (req, res) => this.organization(req, res));
    this.app.get('/api/business-partners/:businessPartnerId/organization', (req, res) => this.organization(req, res));

    this.app.get('/api/suppliers/:businessPartnerId/parents', (req, res) => this.parents(req, res));
    this.app.get('/api/customers/:businessPartnerId/parents', (req, res) => this.parents(req, res));
    this.app.get('/api/business-partners/:businessPartnerId/parents', (req, res) => this.parents(req, res));

    this.app.get('/api/suppliers/:businessPartnerId/children', (req, res) => this.children(req, res));
    this.app.get('/api/customers/:businessPartnerId/children', (req, res) => this.children(req, res));
    this.app.get('/api/business-partners/:businessPartnerId/children', (req, res) => this.children(req, res));
  }

  async organization(req, res) {
    const motherBP = await this.api.findMother(req.params.businessPartnerId);
    if (!motherBP) return res.status('404').json({ message : 'BusinessPartner does not exist!' });

    const businessPartnerChildren = await this.api.all({ hierarchyId: motherBP.id });
    businessPartnerChildren.unshift(motherBP);
    return res.json(businessPartnerChildren);
  }

  async parents(req, res) {
    const businessPartner = await this.api.find(req.params.businessPartnerId);
    if (!businessPartner) return res.status('404').json({ message : 'BusinessPartner does not exist!' });

    if (!businessPartner.hierarchyId) return res.json([]);

    return this.api.all({ id: businessPartner.hierarchyId.split('|').join(',') }).then(bPartners => res.json(bPartners));
  }

  children(req, res) {
    return this.api.all({ hierarchyId: req.params.businessPartnerId }).then(bPartners => res.json(bPartners));
  }
};

module.exports = BusinessPartnerOrganization;
