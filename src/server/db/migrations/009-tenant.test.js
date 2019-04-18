const Sequelize = require('sequelize');
let tenants = require('../data/tenants.json');

module.exports.up = async function(db, config)
{
  tenants.forEach(tenant => tenant.createdOn = new Date());

  return db.queryInterface.bulkInsert('Tenant', tenants);
};

module.exports.down = async function(db, config)
{
  let ids = tenants.map(tenant => tenant.id);

  return db.queryInterface.bulkDelete('Tenant', { id: { $in: ids } });
};
