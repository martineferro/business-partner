const Sequelize = require('sequelize');

/**
 * Initializes all required database models using Sequelize.
 *
 * @param {object} db - [Sequelize]{@link https://github.com/sequelize/sequelize} instance.
 * @param {object} config - Everything from [config.data]{@link https://github.com/OpusCapita/db-init} passed when running the db-initialization.
 * @returns {Promise} JavaScript Promise object.
 * @see [Creating database models]{@link https://github.com/OpusCapita/db-init#creating-database-models}
 */
module.exports.init = async function(db, config)
{
  return Promise.all([
    require('./BusinessPartner').init(db, config),
    require('./BusinessPartnerAddress').init(db, config),
    require('./BusinessPartnerContact').init(db, config),
    require('./BusinessPartnerBankAccount').init(db, config),
    require('./BusinessPartnerCapability').init(db, config),
    require('./BusinessPartner2User').init(db, config),
    require('./BusinessPartnerVisibility').init(db, config),
    require('./BusinessLink').init(db),
    require('./BusinessLinkConnection').init(db),
    require('./Tenant').init(db, config)
  ]);
}
