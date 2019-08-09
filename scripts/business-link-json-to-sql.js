BusinessLink = require('./BusinessLink.json');
BusinessLinkConnection = require('./BusinessLinkConnection.json');

_fs = require('fs');

function convert()
{
  let sqlArray = [];
  const blFields = getFields(BusinessLink);
  const blcFields = getFields(BusinessLinkConnection);

  let blcByBusinessLinkId = BusinessLinkConnection.reduce((acc, blc) => {
    if (!acc[blc.businessLinkId]) acc[blc.businessLinkId] = []
    acc[blc.businessLinkId].push(blc);
    return acc;
  }, {});

  BusinessLink.forEach(bl => {
    bl.createdBy = 'ocadmin';
    bl.changedBy = 'ocadmin';
    const blValues = blFields.map(field => getValue(bl[field]));
    let statementArray = [`INSERT INTO BusinessLink (${blFields.join(',')}) VALUES (${blValues.join(',')});`];

    let blConnections = blcByBusinessLinkId[bl._id];

    if (!blConnections) {
      sqlArray.push(statementArray[0]);
      return;
    }

    const blcValues = blConnections.map(blc => {
      blc.createdBy = 'ocadmin';
      blc.changedBy = 'ocadmin';
      const vals = blcFields.map(field => getValue(blc[field]));
      return `(LAST_INSERT_ID(),${vals.join(',')})`;
    }).join(', ');
    statementArray.push(`INSERT INTO BusinessLinkConnection (businessLinkId,${blcFields.join(',')}) VALUES ${blcValues};`);

    sqlArray.push(statementArray.join('\n'));
  });

  _fs.writeFile('business-link-data.sql', sqlArray.join('\n\n'), err => {
      if (err) return console.error(err);

      console.log('Done.');
  });
};

function getValue(value) {
  if (value === null || value === undefined || value === 'NULL') return 'NULL';

  if (typeof value === 'string') return `'${value}'`;

  return value;
}

function getFields(data) {
  const fields = data.reduce((acc, obj) => {
    const { _id, businessLinkId, ...columns } = obj;
    return acc.concat(Object.keys(columns));
  }, []);
  return [...new Set(fields.concat(['createdBy', 'changedBy']))];
}

(() => convert())();
