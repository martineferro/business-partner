class Client {
  constructor(db) {
    this.model = db.models.Client;
  }

  all() { return this.model.findAll(); }

  find(id) { return this.model.findOne({ where: { id: id } }); }

  create(client) {
    normalize(client);
    ['createdOn', 'changedOn'].forEach(key => delete client[key]);
    return this.model.create(client);
  }

  update(id, client) {
    normalize(client);
    ['id', 'createdBy', 'createdOn'].forEach(key => delete client[key]);
    return this.model.update(client, { where: { id: id } }).then(() => this.find(id));
  }

  delete(id) { return this.model.destroy({ where: { id: id } }).then(() => null); }
};

let normalize = function(client)
{
  for (const fieldName of ['name', 'salesForceId']) {
    if (client[fieldName]) client[fieldName] = client[fieldName].trim();
  }
};

module.exports = Client;
