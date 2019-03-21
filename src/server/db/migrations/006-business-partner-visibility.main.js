const Sequelize = require("sequelize");

const privateType = require('../models/BusinessPartnerVisibility').TYPE.PRIVATE;

module.exports.up = async function (db, config)
{
  return db.queryInterface.createTable('BusinessPartnerVisibility', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    businessPartnerId: {
      type: Sequelize.STRING(30),
      allowNull: false
    },
    contacts: {
      type: Sequelize.STRING(50),
      allowNull: false,
      defaultValue: privateType
    },
    bankAccounts: {
      type: Sequelize.STRING(50),
      allowNull: false,
      defaultValue: privateType
    },
    createdBy: {
      allowNull: false,
      type: Sequelize.STRING(60)
    },
    changedBy: {
      allowNull: true,
      type: Sequelize.STRING(60)
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
  return db.queryInterface.dropTable('BusinessPartnerVisibility');
};
