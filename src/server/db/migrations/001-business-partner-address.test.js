const Sequelize = require('sequelize');

let demoData = require('../data/business-partner-address-demo-data.json');
let addresses = require('../data/business-partner-addresses.json').concat(demoData);

module.exports.up = async function(db, config)
{
  addresses.forEach(address => address.createdOn = new Date());

  return db.queryInterface.bulkInsert('BusinessPartnerAddress', addresses);
};

module.exports.down = async function(db, config)
{
  let ids = addresses.map(address => address.businessPartnerId);

  return db.queryInterface.bulkDelete('BusinessPartnerAddress', { businessPartnerId: { $in: ids } });
};
