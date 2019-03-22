const BusinessPartnerApi = require('../api/BusinessPartner');
const BusinessPartnerVisibilityApi = require('../api/BusinessPartnerVisibility');
const BusinessLinkApi = require('../api/BusinessLink');
const UserData = require('../services/UserData');
const visibilityType = require('../db/models/BusinessPartnerVisibility').TYPE;
const SUPPLIER = 'isSupplier';
const CUSTOMER = 'isCustomer';

class BusinessPartner {
  constructor(app, db) {
    this.app = app;
    this.db = db;
    this.api = new BusinessPartnerApi(db);
    this.visibilityApi = new BusinessPartnerVisibilityApi(db);
    this.businessLinkApi = new BusinessLinkApi(db);
  }

  init() {
    this.app.get('/api/suppliers', (req, res) => this.index(req, res, SUPPLIER));
    this.app.get('/api/customers', (req, res) => this.index(req, res, CUSTOMER));
    this.app.get('/api/business-partners', (req, res) => this.index(req, res));

    this.app.get('/api/suppliers/exists', (req, res) => this.recordExists(req, res, SUPPLIER));
    this.app.get('/api/customers/exists', (req, res) => this.recordExists(req, res, CUSTOMER));
    this.app.get('/api/business-partners/exists', (req, res) => this.recordExists(req, res));

    this.app.get('/api/suppliers/search', (req, res) => this.searchRecord(req, res, SUPPLIER));
    this.app.get('/api/business-partners/search', (req, res) => this.searchRecord(req, res));

    this.app.get('/api/suppliers/:id', (req, res) => this.show(req, res, SUPPLIER));
    this.app.get('/api/customers/:id', (req, res) => this.show(req, res, CUSTOMER));
    this.app.get('/api/business-partners/:id', (req, res) => this.show(req, res));
  }

  async index(req, res, businessType) {
    if (businessType) req.query[businessType] = true;

    if (req.query.electronicAddress) {
      return this.allForElectronicAddress(req, res);
    }

    if (req.query.search !== undefined) {
      const capabilities = req.query.capabilities ? req.query.capabilities.split(',') : [];
      return this.api.searchAll(req.query, capabilities).then(async businessPartners => {
        const businessPartners2send = await this.restrictVisibilities(businessPartners, req);
        return res.json(businessPartners2send);
      });
    } else {
      const includes = req.query.include ? req.query.include.split(',') : [];
      delete req.query.include;

      return this.api.all(req.query, includes).then(async businessPartners => {
        const businessPartners2send = await this.restrictVisibilities(businessPartners, req);
        return res.json(businessPartners2send);
      });
    }
  }

  recordExists(req, res, businessType) {
    if (businessType) req.query[businessType] = true;

    return this.api.recordExists(req.query).then(exists => res.json(exists));
  }

  async searchRecord(req, res, businessType) {
    if (businessType) req.query[businessType] = true;
    const businessPartner = await this.api.searchRecord(req.query);

    if (!businessPartner) return res.status('404').json(businessPartner);

    return res.json(businessPartner);
  }

  async show(req, res, businessType) {
    const includes = req.query.include ? req.query.include.split(',') : [];

    return this.api.find(req.params.id, includes).then(async bPartner => {
      if (!bPartner) return handleNotExists(req.params.id, req, res);

      if (businessType && !bPartner[businessType]) return handleNotExists(req.params.id, req, res);

      const bPartner2send = await this.restrictVisibility(bPartner, req);
      return res.json(bPartner2send);
    });
  }

  async allForElectronicAddress(req, res) {
    try {
      const electronicAddress = req.query.electronicAddress;
      const electronicAddressDecoder = require('@opuscapita/electronic-address');
      const data = electronicAddressDecoder.decode(electronicAddress);

      if (!data.value) return res.status('400').json({ message: `Electronic address ${electronicAddress} could not be decoded` });

      const businessPartners = await this.api.all({ [getIdentifier[data.type]]: data.value });
      const businessPartners2send = await this.restrictVisibilities(businessPartners, req);

      if (businessPartners2send.length <= 1) return res.json(businessPartners2send);

      if (!data.ext) return res.json(businessPartners2send.filter(bp => !Boolean(bp.parentId)));

      return res.json(businessPartners2send.filter(bp => bp.entityCode === data.ext));
    } catch(err) { return res.status('400').json({ message : err.message }) };
  }

  async restrictVisibility(businessPartner, req) {
    let userData = new UserData(req);
    if (!req.query.public && userData.hasAdminRole()) return businessPartner;

    if (!req.query.public && userData.hasSupplierRole() && businessPartner.id === userData.supplierId) return businessPartner;

    if (!businessPartner.contacts && !businessPartner.bankAccounts) return businessPartner;

    const visibility = await this.visibilityApi.find(businessPartner.id);

    ['contacts', 'bankAccounts'].forEach(field => {
      if (!visibility || (visibility && visibility[field] === visibilityType.PRIVATE))
        delete businessPartner[field]
    });

    if (!visibility) return businessPartner;

    if (visibility.contacts !== visibilityType.BUSINESS_PARTNERS && visibility.bankAccounts !== visibilityType.BUSINESS_PARTNERS) return businessPartner;

    const queryParam = businessLinkQueryParam(businessPartner);

    if (!queryParam) return businessPartner;

    const businessLinks = await this.businessLinkApi.all({ [queryParam]: businessPartner.id });

    if (businessLinks.every(link => !userData.customerId || link.customerId !== userData.customerId)) {
      ['contacts', 'bankAccounts'].forEach(field => {
        if (visibility[field] === visibilityType.BUSINESS_PARTNERS) delete businessPartner[field];
      });
    }

    return businessPartner;
  }

  restrictVisibilities(businessPartners, req) {
    return Promise.all(businessPartners.map(bp => this.restrictVisibility(bp, req)));
  }
};

let handleNotExists = function(supplierId, req, res)
{
  const message = 'A record with ID ' + supplierId + ' does not exist.';
  req.opuscapita.logger.error('Error in BusinessPartner request: %s', message);
  return res.status('404').json({ message : message });
};

let businessLinkQueryParam = function(businessPartner)
{
  if (businessPartner.isSupplier) return 'supplierId';

  if (businessPartner.isCustomer) return 'customerId';

  return null;
};

let getIdentifier = { vat: 'vatIdentificationNo', gln: 'globalLocationNo', ovt: 'ovtNo' };

module.exports = BusinessPartner;
