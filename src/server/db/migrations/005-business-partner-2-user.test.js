let businessPartner2users = require('../data/business-partner-2-users.json');

module.exports.up = async function(db, config)
{
  businessPartner2users.forEach(bp2user => bp2user.createdOn = new Date());

  return db.queryInterface.bulkInsert('BusinessPartner2User', businessPartner2users)
};


module.exports.down = async function(db, config)
{
  let ids = businessPartner2users.map(bp2user => bp2user.businessPartnerId);

  return db.queryInterface.bulkDelete('BusinessPartner2User', { businessPartnerId: { $in: ids } });
};
