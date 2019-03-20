const Sequelize = require('sequelize');

let demoData = require('../data/business-partner-demo-data.json');
let businessPartners = require('../data/business-partner.json').concat(demoData);
/**
 * Inserts test data into existing database structures.
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
  businessPartners.forEach(businessPartner => businessPartner.createdOn = new Date());

  return db.queryInterface.bulkInsert('BusinessPartner', businessPartners);
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
  let ids = businessPartners.map(businessPartner => businessPartner.id);

  return db.queryInterface.bulkDelete('BusinessPartner', { id: { $in: ids } });
};
