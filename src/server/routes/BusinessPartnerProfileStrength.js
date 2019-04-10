const BusinessPartnerApi = require('../api/BusinessPartner');

class BusinessPartnerProfileStrength {
  constructor(app, db) {
    this.app = app;
    this.api = new BusinessPartnerApi(db);
  }

  init() {
    this.app.get('/api/suppliers/:businessPartnerId/profile_strength', (req, res) => this.profileStrength(req, res));
    this.app.get('/api/business-partners/:businessPartnerId/profile-strength', (req, res) => this.profileStrength(req, res));
  }

  profileStrength(req, res) {
    return this.api.find(req.params.businessPartnerId, ['contacts', 'bankAccounts', 'addresses']).then(businessPartner => {
      if (!businessPartner) return res.json(0);

      const averages = recordsArray(businessPartner).map(records => {
        if (records.length === 0) return 0;

        return records.reduce((sum, record) => { return sum + recordAverage(record); }, 0) / records.length;
      });

      const average = averages.reduce((sum, num) => { return sum + num; }, 0) / averages.length;

      return res.json(Math.round(average * 100));
    });
  }
};

let recordsArray = function(businessPartner) {
  const addresses = businessPartner.addresses ? businessPartner.addresses.map(record => record.dataValues) : [];
  const contacts = businessPartner.contacts ? businessPartner.contacts.map(record => record.dataValues) : [];
  const bankAccounts = businessPartner.bankAccounts ? businessPartner.bankAccounts.map(record => record.dataValues) : [];

  delete businessPartner.addresses;
  delete businessPartner.contacts;
  delete businessPartner.bankAccounts;

  return [[businessPartner], addresses, contacts, bankAccounts];
}

let recordAverage = function(record) {
  let recordAttributes = Object.keys(record);
  return recordAttributes.filter(attr => Boolean(record[attr])).length / recordAttributes.length;
};

module.exports = BusinessPartnerProfileStrength;
