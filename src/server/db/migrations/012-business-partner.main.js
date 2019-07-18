const Sequelize = require('sequelize');

module.exports.up = async function(db, config)
{
  return db.queryInterface.renameColumn('BusinessPartner', 'tenantId', 'clientId');
};

module.exports.down = async function(db, config)
{
  return db.queryInterface.renameColumn('BusinessPartner', 'clientId', 'tenantId');
};
