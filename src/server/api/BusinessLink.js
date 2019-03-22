class BusinessLink {
  constructor(db) {
    this.model = db.models.BusinessLink;
    this.blcModel = db.models.BusinessLinkConnection;

    this.model.hasMany(this.blcModel, { foreignKey: 'businessLinkId', sourceKey: 'id' });
  }

  create(businessLink) {
    const tenants = { supplierId: businessLink.supplierId, customerId: businessLink.customerId };

    ['id', 'supplierId', 'customerId', 'createdOn', 'changedOn'].forEach(key => delete businessLink[key]);

    normalize(businessLink);
    return this.model.findOrCreate({ where: tenants, defaults: businessLink }).spread((link, created) => link);
  }

  update(id, businessLink) {
    ['id', 'supplierId', 'customerId', 'createdOn', 'changedOn', 'createdBy'].forEach(key => delete businessLink[key]);

    normalize(businessLink);
    return this.model.update(businessLink, { where: { id: id } }).then(() => this.find(id));
  }

  all(query) {
    let dbQuery = {};

    if (query.supplierId) dbQuery.supplierId = query.supplierId;
    if (query.customerId) dbQuery.customerId = query.customerId;
    if (query.supplierIds) dbQuery.supplierId = { $in: query.supplierIds.split(',') };
    if (query.id) dbQuery.id = { $in: query.id.split(',') };

    return this.model.findAll({ where: dbQuery, include: this.determineInclude(query) }).map(bl => {
      return businessLinkWithAssociations(bl);
    });
  }

  find(businessLinkId) {
    return this.model.findOne({ where: { id: businessLinkId }, include: [this.blcModel] }).then(businessLink => {
      return businessLinkWithAssociations(businessLink);
    });
  }

  exists(id) {
    return this.model.findOne({ where: { id: id } }).then(businessLink => Boolean(businessLink));
  }

  delete(ids) {
    return this.model.destroy({ where: { id: { $in: ids } } }).then(() => null);
  }

  determineInclude(query) {
    if (query.connectionStatus) return [{ model: this.blcModel, where: { status: query.connectionStatus }}];

    return [this.blcModel];
  }
};

let businessLinkWithAssociations = function(businessLink)
{
  businessLink.dataValues.connections = businessLink.BusinessLinkConnections;
  delete businessLink.dataValues.BusinessLinkConnections;

  return businessLink.dataValues;
}

let normalize = function(businessLink) {
  if (businessLink.customerSupplierId) businessLink.customerSupplierId = businessLink.customerSupplierId.trim();
}

module.exports = BusinessLink;
