const Sequelize = require('sequelize');

module.exports.up = async function(db, config)
{
  return db.queryInterface.createTable('Tenant', {
    id: {
      type: Sequelize.STRING(30),
      primaryKey: true,
      allowNull: false
    },
    salesForceId: {
      allowNull: true,
      type: Sequelize.STRING(30)
    },
    createdBy : {
      type : Sequelize.STRING(60),
      allowNull : false
    },
    changedBy : {
      type : Sequelize.STRING(60),
      allowNull : true
    },
    createdOn : {
      type : Sequelize.DATE(),
      allowNull : false,
      defaultValue : Sequelize.NOW
    },
    changedOn : {
      type : Sequelize.DATE(),
      allowNull : true,
      defaultValue : Sequelize.NOW
    }
  });
};

module.exports.down = async function(db, config)
{
  return db.queryInterface.dropTable('Tenant');
};
