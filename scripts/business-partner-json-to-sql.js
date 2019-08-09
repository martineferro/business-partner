BusinessPartner = require('./BusinessPartner.json');
BusinessPartnerAddress = require('./BusinessPartnerAddress.json');
BusinessPartnerContact = require('./BusinessPartnerContact.json');
BusinessPartnerBankAccount = require('./BusinessPartnerBankAccount.json');
BusinessPartnerCapability = require('./BusinessPartnerCapability.json');
BusinessPartnerVisibility = require('./BusinessPartnerVisibility.json');
BusinessPartner2User = require('./BusinessPartner2User.json');


_fs = require('fs');

function convert() {
  let sqlArray = [];
  sqlArray.push(sqlStatement('BusinessPartner', BusinessPartner));
  sqlArray.push(sqlStatement('BusinessPartnerAddress', BusinessPartnerAddress));
  sqlArray.push(sqlStatement('BusinessPartnerContact', BusinessPartnerContact));
  sqlArray.push(sqlStatement('BusinessPartnerBankAccount', BusinessPartnerBankAccount));
  sqlArray.push(sqlStatement('BusinessPartnerCapability', BusinessPartnerCapability));
  sqlArray.push(sqlStatement('BusinessPartnerVisibility', BusinessPartnerVisibility));
  sqlArray.push(sqlStatement('BusinessPartner2User', BusinessPartner2User));

  _fs.writeFile('business-partner-data.sql', sqlArray.join('\n\n'), err => {
      if (err) return console.error(err);

      console.log('Done.');
  });
};


function sqlStatement(tableName, data) {
  const fields = getFields(data);
  const values = data.map(obj => {
    const vals = fields.map(field => getValue(obj[field]));
    return `(${vals.join(',')})`;
  }).join(', ');

  return `INSERT IGNORE INTO ${tableName} (${fields.join(',')}) VALUES ${values};`;
}

function getValue(value) {
  if (typeof value === 'string') return `'${value}'`;

  if (value === null || value === undefined) return 'NULL';

  return value;
}

function getFields(data) {
  return [...new Set(data.reduce((acc, obj) => acc.concat(Object.keys(obj)), []))];
}

(() => convert())();
