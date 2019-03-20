const Sequelize = require("sequelize");

module.exports.up = async function (db, config)
{
  return db.queryInterface.createTable('BusinessPartnerBankAccount', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    businessPartnerId: {
      type: Sequelize.STRING(30),
      allowNull: false
    },
    bankName: {
      type: Sequelize.STRING(50),
      allowNull: true
    },
    accountNumber: {
      type: Sequelize.STRING(35),
      allowNull: true
    },
    bankIdentificationCode: {
      type: Sequelize.STRING(15),
      allowNull: true
    },
    bankCountryKey: {
      type: Sequelize.STRING(2),
      allowNull: true
    },
    bankCode: {
      type: Sequelize.STRING(12),
      allowNull: true
    },
    bankgiro: {
      type: Sequelize.STRING(30),
      allowNull: true
    },
    plusgiro: {
      type: Sequelize.STRING(30),
      allowNull: true
    },
    isrNumber: {
      allowNull: true,
      type: Sequelize.STRING(11)
    },
    extBankControlKey: {
      type: Sequelize.STRING(2),
      allowNull: true
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
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW
    },
    changedOn: {
      allowNull: true,
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW
    }
  });
};

module.exports.down = async function(db, config)
{
  return db.queryInterface.dropTable('BusinessPartnerBankAccount');
};
