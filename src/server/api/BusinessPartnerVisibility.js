class BusinessPartnerVisibility {
  constructor(db) {
    this.model = db.models.BusinessPartnerVisibility;
  }

  async createOrUpdate(businessPartnerId, attributes) {
    let visibility = await this.find(businessPartnerId);
    if (!visibility) visibility = this.model.build({ businessPartnerId: businessPartnerId });

    if (attributes.contacts) visibility.contacts = attributes.contacts;
    if (attributes.bankAccounts) visibility.bankAccounts = attributes.bankAccounts;
    if (attributes.createdBy) visibility.createdBy = attributes.createdBy;

    return visibility.save().then(() => this.find(businessPartnerId));
  }

  find(businessPartnerId) {
    return this.model.findOne({ where: { businessPartnerId: businessPartnerId }});
  }

  delete(businessPartnerId) {
    return this.model.destroy({ where: { businessPartnerId: businessPartnerId } }).then(() => null);
  }
};

module.exports = BusinessPartnerVisibility;
