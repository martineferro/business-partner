class BusinessLinkConnection {
  constructor(db) {
    this.model = db.models.BusinessLinkConnection;
  }

  create(businessLinkId, connection) {
    const attributes = { businessLinkId: businessLinkId, type: connection.type };
    normalize(attributes)

    let otherAttributes = connection;
    ['id', 'type', 'createdOn', 'changedOn'].forEach(key => delete otherAttributes[key]);

    return this.model.findOrCreate({ where: attributes, defaults: otherAttributes }).spread((conn, created) => conn);
  }

  update(id, connection) {
    [ 'id', 'type', 'createdOn', 'changedOn' ].forEach(key => delete connection[key]);

    return this.model.update(connection, { where: { id: id } }).then(() => this.find({ id }));
  }

  find({ businessLinkId, id }) {
    let query = {};
    if (businessLinkId) query.businessLinkId = businessLinkId;
    if (id) query.id = id;
    return this.model.findOne({ where: query });
  }

  exists(id) {
    return this.find({ id }).then(connection => Boolean(connection));
  }

  delete({ ids, businessLinkIds }) {
    let query = {};
    if (ids) query.id = { $in: ids };
    if (businessLinkIds) query.businessLinkId = { $in: businessLinkIds };
    return this.model.destroy({ where: query }).then(() => null);
  }
};

let normalize = function(connection)
{
  connection.type = connection.type.toLowerCase().trim().replace(/\s+/g, '-');
}

module.exports = BusinessLinkConnection;
