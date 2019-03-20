const Sequelize = require('sequelize');

const demoData = require('../data/business-partner-bank-account-demo-data.json');
let bankAccounts = require('../data/business-partner-bank-accounts.json').concat(demoData);

module.exports.up = async function(db, config)
{
  bankAccounts.forEach(bankAccount => bankAccount.createdOn = new Date());

  return db.queryInterface.bulkInsert('BusinessPartnerBankAccount', bankAccounts);
};

module.exports.down = async function(db, config)
{
  let ids = bankAccounts.map(bankAccount => bankAccount.businessPartnerId);

  return db.queryInterface.bulkDelete('BusinessPartnerBankAccount', { businessPartnerId: { $in: ids } });
};
