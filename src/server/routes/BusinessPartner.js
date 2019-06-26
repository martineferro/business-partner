const BusinessPartnerApi = require('../api/BusinessPartner');
const BusinessPartnerVisibilityApi = require('../api/BusinessPartnerVisibility');
const BusinessPartnerBankAccountApi = require('../api/BusinessPartnerBankAccount');
const BusinessPartnerAddressApi = require('../api/BusinessPartnerAddress');
const BusinessPartnerContactApi = require('../api/BusinessPartnerContact');
const BusinessPartnerCapabilityApi = require('../api/BusinessPartnerCapability');
const BusinessPartner2UserApi = require('../api/BusinessPartner2User');
const BusinessLinkApi = require('../api/BusinessLink');
const User = require('../services/User');
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
    this.bankAccountApi = new BusinessPartnerBankAccountApi(db);
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

    this.app.post('/api/suppliers', (req, res) => this.create(req, res, SUPPLIER));
    this.app.post('/api/customers', (req, res) => this.create(req, res, CUSTOMER));
    this.app.post('/api/business-partners', (req, res) => this.create(req, res));

    this.app.put('/api/suppliers/:id', (req, res) => this.update(req, res, SUPPLIER));
    this.app.put('/api/customers/:id', (req, res) => this.update(req, res, CUSTOMER));
    this.app.put('/api/business-partners/:id', (req, res) => this.update(req, res));

    this.app.delete('/api/suppliers/:id', (req, res) => this.delete(req, res, SUPPLIER));
    this.app.delete('/api/customers/:id', (req, res) => this.delete(req, res, CUSTOMER));
    this.app.delete('/api/business-partners/:id', (req, res) => this.delete(req, res));
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

  create(req, res, businessType) {
    const newBpartner = req.body;
    let userData = new UserData(req);

    const fieldsToCheck = function(bPartner) {
      return {
        id: bPartner.id,
        name: bPartner.name,
        cityOfRegistration: bPartner.cityOfRegistration,
        countryOfRegistration: bPartner.countryOfRegistration,
        taxIdentificationNo: bPartner.taxIdentificationNo,
        commercialRegisterNo: bPartner.commercialRegisterNo,
        vatIdentificationNo: bPartner.vatIdentificationNo,
        dunsNo: bPartner.dunsNo,
        globalLocationNo: bPartner.globalLocationNo,
        ovtNo: bPartner.ovtNo
      };
    };

    this.api.recordExists(fieldsToCheck(newBpartner)).then(exists => {
      if (exists) return res.status('409').json({ message : 'A business partner already exists' });

      if (!userData.hasAdminRole()) {
        if (userData.businessPartnerId) return res.status('403').json({ message : 'User already has a business partner' });

        if (!this.api.hasUniqueIdentifier(newBpartner)) return res.status('400').json({ message: 'BusinessPartner must have a unique identifier' });
      }

      const iban = newBpartner.iban;
      delete newBpartner.iban;

      newBpartner.statusId = 'new';
      newBpartner.createdBy = userData.id;
      newBpartner.changedBy = userData.id;
      if (businessType) newBpartner[businessType] = true;

      return this.api.create(newBpartner).then(businessPartner => {
          if (userData.hasAdminRole()) return res.status('200').json(businessPartner);

          if (businessType === CUSTOMER) return res.status('200').json(businessPartner);

          const businessPartnerId = businessPartner.id;
          const user = { businessPartnerId: businessPartnerId, status: 'registered', roles: ['user', 'supplier-admin'] };

          const userService = new User(req.opuscapita.serviceClient);
          return Promise.all([
              userService.update(userData.id, user),
              userService.removeRoleFromUser(userData.id, 'registering_supplier')
          ]).then(() => {
              businessPartner.statusId = 'assigned';

              const bp1 = Object.assign({ }, businessPartner.dataValues);
              const bp2 = Object.assign({ }, businessPartner.dataValues); // Copy needed as BusinessPartner.update() seems to modify supp which then destroys createBankAccount().

              return Promise.all([this.api.update(businessPartnerId, bp1), this.createBankAccount(iban, bp2)]).spread((bPartner, account) => {
                return res.status('200').json(bPartner);
              });
            }).catch(error => {
              this.api.delete(businessPartnerId).then(() => null);
              req.opuscapita.logger.error('Error when creating BusinessPartner: %s', error.message);

              return res.status((error.response && error.response.statusCode) || 400).json({ message : error.message });
            });
        }).catch(error => {
          req.opuscapita.logger.error('Error when creating Supplier: %s', error.message);

          return res.status((error.response && error.response.statusCode) || 400).json({ message : error.message });
        });
    })
    .catch(error => {
      req.opuscapita.logger.error('Error when creating Supplier: %s', error.message);
      return res.status('400').json({ message : error.message });
    });
  }

  async update(req, res) {
    let businessPartnerId = req.params.id;
    let editedBusinessPartner = req.body;

    if (businessPartnerId !== editedBusinessPartner.id) {
      const message = 'Inconsistent data';
      req.opuscapita.logger.error('Error when updating Supplier: %s', message);
      return res.status('422').json({ message: message });
    }

    let userData = new UserData(req);

    try {
      let businessPartner = await this.api.find(businessPartnerId);

      if (!businessPartner) return handleNotExists(businessPartnerId, req, res);

      for (const field of Object.keys(editedBusinessPartner)) {
        businessPartner[field] = editedBusinessPartner[field];
      }
      if (!userData.hasAdminRole() && !this.api.hasUniqueIdentifier(businessPartner))
      return res.status('400').json({ message: 'BusinessPartner must have a unique identifier' });

      editedBusinessPartner.statusId = 'updated';
      editedBusinessPartner.changedBy = userData.id;
      const bPartner = await this.api.update(businessPartnerId, editedBusinessPartner);
      await req.opuscapita.eventClient.emit('business-partner.business-partner.updated', bPartner);

      return res.status('200').json(bPartner);
    } catch(error) {
      req.opuscapita.logger.error('Error when updating BusinessPartner: %s', error.message);
      return res.status('400').json({ message : error.message });
    }
  }

  async delete(req, res) {
    const bPartnerId = req.params.id;

    try {
      const businessPartner = await this.api.find(bPartnerId);

      if (!businessPartner) return handleNotExists(bPartnerId, req, res);

      await this.api.delete(bPartnerId);

      const capApi = new BusinessPartnerCapabilityApi(this.db);
      const addressApi = new BusinessPartnerAddressApi(this.db);
      const bp2UserApi = new BusinessPartner2UserApi(this.db);
      const contactApi = new BusinessPartnerContactApi(this.db);

      await Promise.all([
        this.bankAccountApi.delete(bPartnerId), addressApi.delete(bPartnerId),
        bp2UserApi.delete(bPartnerId), contactApi.delete(bPartnerId), capApi.delete(bPartnerId),
        this.businessLinkApi.delete(bPartnerId), this.visibilityApi.delete(bPartnerId)
      ]);

      // await req.opuscapita.eventClient.emit('business-partner.business-partner.deleted', { id: bPartnerId });

      return res.status('200').json({ message: `BusinessPartner with id ${bPartnerId} deleted.` })
    } catch(error) {
      req.opuscapita.logger.error('Error when deleting BusinessPartner: %s', error.message);
      return res.status('400').json({ message : error.message });
    }
  }

  createBankAccount(iban, businessPartner) {
    if (!iban) return Promise.resolve();

    const bankAccount = {
      accountNumber: iban,
      businessPartnerId: businessPartner.id,
      createdBy: businessPartner.createdBy,
      changedBy: businessPartner.createdBy
    };

    return this.bankAccountApi.create(bankAccount);
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

let handleNotExists = function(businessPartnerId, req, res)
{
  const message = 'A record with ID ' + businessPartnerId + ' does not exist.';
  req.opuscapita.logger.error('Error in BusinessPartner request: %s', message);
  return res.status('404').json({ message : message });
};

let businessLinkQueryParam = function(businessPartner)
{
  if (businessPartner.isSupplier) return 'supplierId';

  if (businessPartner.isCustomer) return 'customerId';

  return null;
};

let getIdentifier = {
  vat: 'vatIdentificationNo',
  gln: 'globalLocationNo',
  ovt: 'ovtNo',
  orgnr: 'commercialRegisterNo',
  duns: 'dunsNo'
};

module.exports = BusinessPartner;
