let contacts = require('../data/business-partner-contacts.json');

module.exports.up = async function(db, config)
{
  contacts.forEach(contact => contact.createdOn = new Date());

  return db.queryInterface.bulkInsert('BusinessPartnerContact', contacts)
};


module.exports.down = async function(db, config)
{
  let ids = contacts.map(contact => contact.businessPartnerId);

  return db.queryInterface.bulkDelete('BusinessPartnerContact', { businessPartnerId: { $in: ids } });
};
