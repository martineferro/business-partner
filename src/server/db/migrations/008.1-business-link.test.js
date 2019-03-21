let businessLinkData = require('../data/business-links.json');
const connectionData = require('../data/business-link-connection.json');

module.exports.up = async function(db, config)
{
  businessLinkData.forEach(businessLink => businessLink.createdOn = new Date());

  await db.queryInterface.bulkInsert('BusinessLink', businessLinkData);

  const customerId = businessLinkData[0].customerId
  const businessLinks = await db.models.BusinessLink.findAll({ where: { customerId: customerId } });
  const blConnections = businessLinks.map(bl => {
    return { ...connectionData, businessLinkId: bl.dataValues.id, createdOn: new Date() };
  });

  return db.queryInterface.bulkInsert('BusinessLinkConnection', blConnections);
};

module.exports.down = async function(db, config)
{
  const customerId = businessLinkData[0].customerId
  const businessLinks = await db.models.BusinessLink.findAll({ where: { customerId: customerId } });
  const businessLinkIds = businessLinks.map(bl => bl.dataValues.id);

  await db.queryInterface.bulkDelete('BusinessLinkConnection', { businessLinkId: { $in: businessLinkIds } });
  return db.queryInterface.bulkDelete('BusinessLink', { id: { $in: businessLinkIds } });
};

