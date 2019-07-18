const Sequelize = require('sequelize');

module.exports.up = async function(db, config)
{
  return db.queryInterface.addColumn('Tenant', 'name', { type: Sequelize.STRING(100), allowNull: true });
};

module.exports.down = async function(db, config)
{
  return db.queryInterface.removeColumn('Tenant', 'name');
};
