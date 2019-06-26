const utils = require('../utils/lib');

class BusinessPartnerContact {
  constructor(db) {
    this.model = db.models.BusinessPartnerContact;
  }

  all(businessPartnerId) {
    return this.model.findAll({ where: { businessPartnerId: businessPartnerId } });
  }

  find(businessPartnerId, contactId) {
    return this.model.findOne({ where: { businessPartnerId: businessPartnerId, id: contactId } });
  }

  create(contact) {
    [ 'id', 'createdOn', 'changedOn' ].forEach(key => delete contact[key]);
    return this.model.create(contact);
  }

  update(businessPartnerId, contactId, contact) {
    [ 'id', 'businessPartnerId', 'createdBy', 'createdOn' ].forEach(key => delete contact[key]);
    return this.model.update(contact, { where: { id: contactId } }).then(() => {
      return this.find(businessPartnerId, contactId);
    });
  }

  delete(businessPartnerId, contactId) {
    let deleteQuery = { businessPartnerId: businessPartnerId };
    if (contactId) deleteQuery.id = contactId;
    return this.model.destroy({ where: deleteQuery }).then(() => null);
  }

  exists(businessPartnerId, contactId) {
    return this.find(businessPartnerId, contactId).then(contact => Boolean(contact));
  }
};

module.exports = BusinessPartnerContact;
