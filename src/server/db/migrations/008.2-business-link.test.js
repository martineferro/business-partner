let businessLinkDemoData = require('../data/business-link-demo-data.json');
let connectionsDemoData = require('../data/business-link-connection-demo-data.json');

module.exports.up = async function(db, config)
{
  businessLinkDemoData.forEach(businessLink => businessLink.createdOn = new Date());

  await db.queryInterface.bulkInsert('BusinessLink', businessLinkDemoData);

  const customerId = businessLinkDemoData[0].customerId;
  const supplierIds = businessLinkDemoData.map(bl => bl.supplierId);
  const businessLinks = await db.models.BusinessLink.findAll({ where: { customerId: customerId, supplierId: { $in: supplierIds } } });

  const blConnections = businessLinks.reduce((acc, bl) => {
    const data = connectionsDemoData.map(conn => ({ ...conn, businessLinkId: bl.dataValues.id, createdOn: new Date() }));
    return acc.concat(data);
  }, []);

  return db.queryInterface.bulkInsert('BusinessLinkConnection', blConnections);
};

module.exports.down = async function(db, config)
{
  const customerId = businessLinkDemoData[0].customerId;
  const supplierIds = businessLinkDemoData.map(bl => bl.supplierId);
  const businessLinks = await db.models.BusinessLink.findAll({ where: { customerId: customerId, supplierId: { $in: supplierIds } } });
  const businessLinkIds = businessLinks.map(bl => bl.dataValues.id);

  await db.queryInterface.bulkDelete('BusinessLinkConnection', { businessLinkId: { $in: businessLinkIds } });
  return db.queryInterface.bulkDelete('BusinessLink', { id: { $in: businessLinkIds } });
};
