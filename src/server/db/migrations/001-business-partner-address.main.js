const Sequelize = require("sequelize");

module.exports.up = async function (db, config)
{
  return db.queryInterface.createTable('BusinessPartnerAddress', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    businessPartnerId: {
      type: Sequelize.STRING(30),
      allowNull: false
    },
    type: {
      type: Sequelize.STRING(35),
      allowNull: false,
      defaultValue: require('../models/BusinessPartnerAddress').TYPE.DEFAULT
    },
    name: {
      type: Sequelize.STRING(50),
      allowNull: true
    },
    street1: {
      type: Sequelize.STRING(100),
      allowNull: false
    },
    street2: {
      type: Sequelize.STRING(100),
      allowNull: true
    },
    street3: {
      type: Sequelize.STRING(100),
      allowNull: true
    },
    zipCode: {
      type: Sequelize.STRING(10),
      allowNull: true
    },
    city: {
      type: Sequelize.STRING(50),
      allowNull: false
    },
    poboxZipCode: {
      type: Sequelize.STRING(10),
      allowNull: true
    },
    pobox: {
      type: Sequelize.STRING(10),
      allowNull: true
    },
    areaCode: {
      type: Sequelize.STRING(10),
      allowNull: true
    },
    state: {
      type: Sequelize.STRING(50),
      allowNull: true
    },
    countryId: {
      type: Sequelize.STRING(2),
      allowNull: false
    },
    phoneNo: {
      type: Sequelize.STRING(50),
      allowNull: true
    },
    faxNo: {
      type: Sequelize.STRING(50),
      allowNull: true
    },
    email: {
      type: Sequelize.STRING(1024),
      allowNull: true
    },
    corporateURL: {
      type: Sequelize.STRING(1024),
      allowNull: true
    },
    numOfEmployees: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    changedBy: {
      type: Sequelize.STRING(60),
      allowNull: true
    },
    createdBy: {
      type: Sequelize.STRING(60),
      allowNull: false,
    },
    createdOn: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW
    },
    changedOn: {
      type: Sequelize.DATE,
      allowNull: true,
      defaultValue: Sequelize.NOW
    }
  });
};

module.exports.down = async function(db, config)
{
  return db.queryInterface.dropTable('BusinessPartnerAddress');
};
