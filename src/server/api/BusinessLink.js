class BusinessLink {
  constructor(db) {
    this.model = db.models.BusinessLink;
    this.blcModel = db.models.BusinessLinkConnection;
    this.bpartnerModel = db.models.BusinessPartner;

    this.model.hasMany(this.blcModel, { as: 'connections', foreignKey: 'businessLinkId', sourceKey: 'id' });

    this.model.belongsTo(this.bpartnerModel, { as: 'supplier', foreignKey: 'supplierId' });
    this.model.belongsTo(this.bpartnerModel, { as: 'customer', foreignKey: 'customerId' });
  }

  create(businessLink) {
    const tenants = { supplierId: businessLink.supplierId, customerId: businessLink.customerId };

    ['id', 'supplierId', 'customerId', 'createdOn', 'changedOn'].forEach(key => delete businessLink[key]);

    normalize(businessLink);
    return this.model.findOrCreate({ where: tenants, defaults: businessLink }).spread((link, created) => link);
  }

  update(id, businessLink) {
    [
      'id', 'supplierId', 'customerId', 'supplier',
      'customer', 'createdOn', 'changedOn', 'createdBy'
    ].forEach(key => delete businessLink[key]);

    normalize(businessLink);
    return this.model.update(businessLink, { where: { id: id } }).then(() => this.find(id));
  }

  all(query, includes = []) {
    let dbQuery = {};

    if (query.supplierId) dbQuery.supplierId = query.supplierId;
    if (query.customerId) dbQuery.customerId = query.customerId;
    if (query.supplierIds) dbQuery.supplierId = { $in: query.supplierIds.split(',') };
    if (query.id) dbQuery.id = { $in: query.id.split(',') };
    if (query.businessPartnerId)
      dbQuery['$or'] = [{ customerId: query.businessPartnerId }, { supplierId: query.businessPartnerId }];

    let modelIncludes = this.determineInclude(query);

    if (includes.length > 0) this.addIncludes(includes, modelIncludes);

    return this.model.findAll({ where: dbQuery, include: modelIncludes }).map(bl => bl.dataValues);
  }

  find(businessLinkId, includes = []) {
    let modelIncludes = this.determineInclude();

    if (includes.length > 0) this.addIncludes(includes, modelIncludes);

    return this.model.findOne({ where: { id: businessLinkId }, include: modelIncludes }).then(businessLink => {
      return businessLink && businessLink.dataValues;
    });
  }

  exists(id) {
    return this.model.findOne({ where: { id: id } }).then(businessLink => Boolean(businessLink));
  }

  async delete(businessPartnerId) {
    const query = { $or: [{ customerId: businessPartnerId }, { supplierId: businessPartnerId }] };
    const businessLinks = await this.model.findAll({ where: query });

    if (businessLinks.length === 0) return;

    const businessLinkIds = businessLinks.map(bl => bl.id);

    await this.blcModel.destroy({ where: { businessLinkId: { $in: businessLinkIds } } });

    return this.model.destroy({ where: { id: { $in: businessLinkIds } } }).then(() => null);
  }

  determineInclude(query = {}) {
    const attrs = { model: this.blcModel, as: 'connections' };
    if (query.connectionStatus) return [{ ...attrs, where: { status: query.connectionStatus }}];

    return [attrs];
  }

  addIncludes(includes, modelIncludes) {
    for (const include of includes) {
      if (include === 'supplier') modelIncludes.push({ model: this.bpartnerModel, as: 'supplier' });
      if (include === 'customer') modelIncludes.push({ model: this.bpartnerModel, as: 'customer' });
    }
  }
};

let normalize = function(businessLink) {
  if (businessLink.customerSupplierId) businessLink.customerSupplierId = businessLink.customerSupplierId.trim();
}

module.exports = BusinessLink;
