const Sequelize = require("sequelize");

module.exports.up = async function (db, config)
{
  const fields = [
    'name',
    'cityOfRegistration',
    'taxIdentificationNo',
    'vatIdentificationNo',
    'commercialRegisterNo',
    'dunsNo',
    'globalLocationNo'
  ];

  return db.queryInterface.addIndex('BusinessPartner', fields, { indexName: 'SearchIndex', indicesType: 'FULLTEXT' });
};

module.exports.down = async function(db, config)
{
  return db.queryInterface.removeIndex('BusinessPartner', 'SearchIndex');
};
