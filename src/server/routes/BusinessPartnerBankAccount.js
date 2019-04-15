const BusinessPartnerBankAccountApi = require('../api/BusinessPartnerBankAccount');
const UserData = require('../services/UserData');

class BusinessPartnerBankAccount {
  constructor(app, db) {
    this.app = app;
    this.api = new BusinessPartnerBankAccountApi(db);
  }

  init() {
    this.app.get('/api/suppliers/:businessPartnerId/bank_accounts', (req, res) => this.index(req, res));
    this.app.get('/api/customers/:businessPartnerId/bank_accounts', (req, res) => this.index(req, res));
    this.app.get('/api/business-partners/:businessPartnerId/bank-accounts', (req, res) => this.index(req, res));

    this.app.post('/api/suppliers/:businessPartnerId/bank_accounts', (req, res) => this.create(req, res));
    this.app.post('/api/customers/:businessPartnerId/bank_accounts', (req, res) => this.create(req, res));
    this.app.post('/api/business-partners/:businessPartnerId/bank-accounts', (req, res) => this.create(req, res));

    this.app.get('/api/suppliers/:businessPartnerId/bank_accounts/:bankAccountId', (req, res) => this.show(req, res));
    this.app.get('/api/customers/:businessPartnerId/bank_accounts/:bankAccountId', (req, res) => this.show(req, res));
    this.app.get('/api/business-partners/:businessPartnerId/bank-accounts/:bankAccountId', (req, res) => this.show(req, res));

    this.app.get('/api/business-partners/bank-accounts/exists', (req, res) => this.exists(req, res));

    this.app.put('/api/suppliers/:businessPartnerId/bank_accounts/:bankAccountId', (req, res) => this.update(req, res));
    this.app.put('/api/customers/:businessPartnerId/bank_accounts/:bankAccountId', (req, res) => this.update(req, res));
    this.app.put('/api/business-partners/:businessPartnerId/bank-accounts/:bankAccountId', (req, res) => this.update(req, res));

    this.app.delete('/api/suppliers/:businessPartnerId/bank_accounts/:bankAccountId', (req, res) => this.delete(req, res));
    this.app.delete('/api/customers/:businessPartnerId/bank_accounts/:bankAccountId', (req, res) => this.delete(req, res));
    this.app.delete('/api/business-partners/:businessPartnerId/bank-accounts/:bankAccountId', (req, res) => this.delete(req, res));
  }

  index(req, res) {
    return this.api.all(req.params.businessPartnerId).then(accounts => res.json(accounts));
  }

  show(req, res) {
    return this.api.find(req.params.businessPartnerId, req.params.bankAccountId).then(account => {
      if (!account) return res.status('404').json({ message: 'Not found' });

      return res.json(account);
    });
  }

  exists(req, res) {
    return this.api.recordExists(req.query).then(exists => res.json(exists));
  }

  async create(req, res) {
    if (!this.api.hasUniqueIdentifier(req.body)) return noUniqueIdentifierResponse(res);

    const userData = new UserData(req);
    req.body.businessPartnerId = req.params.businessPartnerId;
    req.body.createdBy = userData.id;
    req.body.changedBy = userData.id;

    return this.api.create(req.body).then(async bankAccount => {
      await emitEvent(req, bankAccount, 'created');
      return res.status('201').json(bankAccount);
    }).catch(e => res.status('400').json({message: e.message}));
  }

  async update(req, res) {
    const bankAccountId = req.params.bankAccountId;
    const businessPartnerId = req.params.businessPartnerId;
    let attributes = req.body;
    const account = await this.api.find(businessPartnerId, bankAccountId);

    if (!account) return res.status('404').json({message: 'A supplier bankAccount with this ID does not exist.'});

    for (const field of Object.keys(attributes)) {
      account[field] = attributes[field];
    }
    if (!this.api.hasUniqueIdentifier(account)) return noUniqueIdentifierResponse(res);

    attributes.changedBy = new UserData(req).id;
    return this.api.update(businessPartnerId, bankAccountId, attributes).then(async bankAccount => {
      await emitEvent(req, bankAccount, 'updated');
      return res.status('200').json(bankAccount);
    }).catch(e => res.status('400').json({message: e.message}));
  }

  delete(req, res) {
    return this.api.delete(req.params.businessPartnerId, req.params.bankAccountId)
      .then(() => res.json(null)).catch(e => res.status('400').json({message: e.message}));
  }
};

let emitEvent = function(req, payload, type)
{
  return req.opuscapita.eventClient.emit(`supplier.bank-account.${type}`, payload);
};

let noUniqueIdentifierResponse = function(res)
{
   return res.status('400').json({message: 'Either IBAN, bankgiro, or plusgiro must be provided.'});
};

module.exports = BusinessPartnerBankAccount;
