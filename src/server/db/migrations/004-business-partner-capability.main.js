const Sequelize = require("sequelize");

module.exports.up = async function (db, config)
{
  return db.queryInterface.createTable('BusinessPartnerCapability', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      businessPartnerId: {
        type: Sequelize.STRING(30),
        allowNull: false
      },
      capabilityId: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      createdBy: {
        type: Sequelize.STRING(60),
        allowNull: false
      },
      changedBy: {
        type: Sequelize.STRING(60),
        allowNull: true
      },
      createdOn: {
        type: Sequelize.DATE(),
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      changedOn: {
        type: Sequelize.DATE(),
        allowNull: true,
        defaultValue: Sequelize.NOW
      }
    });
};

module.exports.down = async function(db, config)
{
  return db.queryInterface.dropTable('BusinessPartnerCapability');
};
