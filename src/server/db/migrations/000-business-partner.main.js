const Sequelize = require('sequelize');

/**
 * Applies migrations for databse tables and data.
 * If all migrations were successul, this method will never be executed again.
 * To identify which migrations have successfully been processed, a migration's filename is used.
 *
 * @param {object} data - [Sequelize]{@link https://github.com/sequelize/sequelize} instance.
 * @param {object} config - A model property for database models and everything from [config.data]{@link https://github.com/OpusCapita/db-init} passed when running the db-initialization.
 * @returns {Promise} JavaScript Promise object.
 * @see [Applying data migrations]{@link https://github.com/OpusCapita/db-init#applying-data-migrations}
 */
module.exports.up = async function(db, config)
{
  return db.queryInterface.createTable('BusinessPartner', {
    id: {
      type: Sequelize.STRING(30),
      primaryKey: true,
      allowNull: false
    },
    tenantId: {
      allowNull: true,
      type: Sequelize.STRING(30)
    },
    isCustomer: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    isSupplier: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    entityCode: {
      allowNull: true,
      type: Sequelize.STRING(30)
    },
    parentId: {
      allowNull: true,
      type: Sequelize.STRING(30)
    },
    hierarchyId: {
      allowNull: true,
      type: Sequelize.STRING(900)
    },
    name: {
      allowNull: false,
      type: Sequelize.STRING(50)
    },
    information: {
      allowNull: true,
      type: Sequelize.STRING(100)
    },
    foundedOn: {
      allowNull: true,
      type: Sequelize.DATE()
    },
    legalForm: {
      allowNull: true,
      type: Sequelize.STRING(250)
    },
    commercialRegisterNo: {
      allowNull: true,
      type: Sequelize.STRING(250)
    },
    cityOfRegistration: {
      allowNull: true,
      type: Sequelize.STRING(250)
    },
    countryOfRegistration: {
      allowNull: true,
      type: Sequelize.STRING(2)
    },
    currencyId: {
      allowNull: true,
      type: Sequelize.STRING(3)
    },
    taxIdentificationNo: {
      allowNull: true,
      type: Sequelize.STRING(20)
    },
    vatIdentificationNo: {
      allowNull: true,
      type: Sequelize.STRING(20)
    },
    globalLocationNo: {
      allowNull: true,
      type: Sequelize.STRING(250)
    },
    homePage: {
      allowNull: true,
      type: Sequelize.STRING(250)
    },
    dunsNo: {
      allowNull: true,
      type: Sequelize.STRING(20)
    },
    ovtNo: {
      allowNull: true,
      type: Sequelize.STRING(250)
    },
    noVatReason: {
      allowNull: true,
      type: Sequelize.STRING(500)
    },
    statusId: {
      allowNull: true,
      type: Sequelize.STRING(100)
    },
    managed: {
      allowNull: true,
      type: Sequelize.BOOLEAN,
      defaultValue : true
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
      allowNull : true
    }
  });
};

/**
 * Reverts all migrations for databse tables and data.
 * If the migration process throws an error, this method is called in order to revert all changes made by the up() method.
 *
 * @param {object} data - [Sequelize]{@link https://github.com/sequelize/sequelize} instance.
 * @param {object} config - A model property for database models and everything from [config.data]{@link https://github.com/OpusCapita/db-init} passed when running the db-initialization.
 * @returns {Promise} JavaScript Promise object.
 * @see [Applying data migrations]{@link https://github.com/OpusCapita/db-init#applying-data-migrations}
 */
module.exports.down = async function(db, config)
{
  return db.queryInterface.dropTable('BusinessPartner');
};
