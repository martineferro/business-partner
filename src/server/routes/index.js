const BusinessPartner = require('./BusinessPartner');
const BusinessPartnerAddress = require('./BusinessPartnerAddress');
const BusinessPartnerBankAccount = require('./BusinessPartnerBankAccount');
const BusinessPartnerContact = require('./BusinessPartnerContact');
const BusinessPartnerOrganization = require('./BusinessPartnerOrganization');
const BusinessPartnerVisibility = require('./BusinessPartnerVisibility');
const BusinessPartnerCapability = require('./BusinessPartnerCapability');
const BusinessPartnerAccess = require('./BusinessPartnerAccess');
const BusinessPartnerProfileStrength = require('./BusinessPartnerProfileStrength');
const BusinessLink = require('./BusinessLink');
const DataMigration = require('./DataMigration');

/**
 * Initializes all routes for RESTful access.
 *
 * @param {object} app - [Express]{@link https://github.com/expressjs/express} instance.
 * @param {object} db - If passed by the web server initialization, a [Sequelize]{@link https://github.com/sequelize/sequelize} instance.
 * @param {object} config - Everything from [config.routes]{@link https://github.com/OpusCapita/web-init} passed when running the web server initialization.
 * @returns {Promise} JavaScript Promise object.
 * @see [Minimum setup]{@link https://github.com/OpusCapita/web-init#minimum-setup}
 */
module.exports.init = async function(app, db, config)
{
  new BusinessPartner(app, db).init();
  new BusinessPartnerAddress(app, db).init();
  new BusinessPartnerBankAccount(app, db).init();
  new BusinessPartnerContact(app, db).init();
  new BusinessPartnerOrganization(app, db).init();
  new BusinessPartnerVisibility(app, db).init();
  new BusinessPartnerCapability(app, db).init();
  new BusinessPartnerAccess(app, db).init();
  new BusinessPartnerProfileStrength(app, db).init();
  new BusinessLink(app, db).init();
  new DataMigration(app, db).init();

}
