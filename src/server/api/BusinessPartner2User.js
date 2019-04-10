class BusinessPartner2User {
  constructor(db) {
    this.model = db.models.BusinessPartner2User;
  }

  all(businessPartnerId) {
    return this.model.findAll({ where: { businessPartnerId: businessPartnerId } });
  }

  find(userId, id = null) {
    let query = { userId: userId };
    if (id) query.id = id;
    return this.model.findOne({ where: query });
  }

  create(supplier2user) {
    return this.model.create(supplier2user);
  }

  update(id, supplier2user) {
    const attributes = { status: supplier2user.status };
    const userId = supplier2user.userId;
    return this.model.update(attributes, { where: { id: id }}).then(() => this.find(userId, id));
  }

  delete(businessPartnerId) {
    return this.model.destroy({ where: { businessPartnerId: businessPartnerId } }).then(() => null);
  }

  exists(id) {
    return this.model.findOne({ where: { id: id }}).then(supplier2user => Boolean(supplier2user));
  }
};

module.exports = BusinessPartner2User;
