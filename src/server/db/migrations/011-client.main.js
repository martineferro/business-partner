const Sequelize = require('sequelize');

module.exports.up = async function(db, config)
{
  return db.queryInterface.renameTable('Tenant', 'Client');
};

module.exports.down = async function(db, config)
{
  return db.queryInterface.renameTable('Client', 'Tenant');
};
