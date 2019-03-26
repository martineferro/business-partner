class BusinessPartnerAddress {
  constructor(db) {
    this.model = db.models.BusinessPartnerAddress;
  }

  all(businessPartnerId) {
    return this.model.findAll({ where: { businessPartnerId: businessPartnerId } });
  }

  find(businessPartnerId, addressId) {
    return this.model.findOne({ where: { businessPartnerId: businessPartnerId, id: addressId } });
  }

  create(address) {
    return this.model.create(address);
  }

  update(businessPartnerId, addressId, address) {
    return this.model.update(address, { where: { id: addressId } }).then(() => {
      return this.find(businessPartnerId, addressId);
    });
  }

  delete(businessPartnerId, addressId) {
    let deleteQuery = { businessPartnerId: businessPartnerId };
    if (addressId) deleteQuery.id = addressId;
    return this.model.destroy({ where: deleteQuery }).then(() => null);
  }

  addressExists(businessPartnerId, addressId) {
    return this.find(businessPartnerId, addressId).then(address => Boolean(address));
  }
};

module.exports = BusinessPartnerAddress;
