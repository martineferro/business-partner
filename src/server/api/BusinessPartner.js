const SqlString = require('sequelize/lib/sql-string');
const utils = require('../utils/lib');
const uniqueIdentifier = require('../utils/validators/uniqueIdentifier');

class BusinessPartner {
  constructor(db) {
    this.db = db;
    this.model = db.models.BusinessPartner;
    this.tableName = this.model.tableName;
    this.capabilityTableName = db.models.BusinessPartnerCapability.tableName;

    this.model.hasMany(db.models.BusinessPartnerContact, { foreignKey: 'businessPartnerId', sourceKey: 'id' });
    this.model.hasMany(db.models.BusinessPartnerAddress, { foreignKey: 'businessPartnerId', sourceKey: 'id' });
    this.model.hasMany(db.models.BusinessPartnerBankAccount, { foreignKey: 'businessPartnerId', sourceKey: 'id' });
    this.model.hasMany(db.models.BusinessPartnerCapability, { foreignKey: 'businessPartnerId', sourceKey: 'id' });

    this.associations = {
      contacts: db.models.BusinessPartnerContact,
      addresses: db.models.BusinessPartnerAddress,
      bankAccounts: db.models.BusinessPartnerBankAccount,
      capabilities: db.models.BusinessPartnerCapability
    };
  }

  async all(query, includes) {
    let queryObj = {};
    if (query.id) queryObj.id = { $in: query.id.split(',') };
    if (query.name) queryObj.name = { $like: `%${query.name}%` };
    if (query.hierarchyId) queryObj['$or'] = hierarchyQuery(query.hierarchyId);
    if (query.vatIdentificationNo) queryObj.vatIdentificationNo = query.vatIdentificationNo;
    if (query.globalLocationNo) queryObj.globalLocationNo = query.globalLocationNo;
    if (query.ovtNo) queryObj.ovtNo = query.ovtNo;
    if (query.isCustomer) queryObj.isCustomer = query.isCustomer;
    if (query.isSupplier) queryObj.isSupplier = query.isSupplier;

    const includeModels = this.associationsFromIncludes(includes || []);

    const businessPartners = await this.model.findAll({ where: queryObj, include: includeModels });

    return businessPartners.map(bp => businessPartnerWithAssociations(bp));
  }

  searchAll(searchQuery, capabilities) {
    let searchValue = searchQuery.search;
    const search = searchValue.replace(/\W+/g, '* ') + '*';
    const searchFields = [
      'name',
      'cityOfRegistration',
      'taxIdentificationNo',
      'vatIdentificationNo',
      'commercialRegisterNo',
      'dunsNo',
      'globalLocationNo'
    ].join(',');

    const select = `SELECT ${this.attributes()}, ${this.capabilityTableName}.capabilityId FROM ${this.tableName} `;
    const joinType = capabilities.length === 0 ? 'LEFT' : 'INNER';
    const join = `${joinType} JOIN ${this.capabilityTableName} ON ${this.tableName}.id = ${this.capabilityTableName}.businessPartnerId `;
    const matchQuery = `WHERE MATCH (${searchFields}) AGAINST ('${search}' IN BOOLEAN MODE)`;
    let typeQuery = '';
    if (searchQuery.isSupplier) typeQuery = 'isSupplier IS TRUE';
    if (searchQuery.isCustomer) typeQuery = 'isCustomer IS TRUE';

    const capabilityQuery = capabilities.map(cap => `${this.capabilityTableName}.capabilityId = ${SqlString.escape(cap)}`).join(' OR ');

    let query = select + join + determineWhere(searchValue, matchQuery, typeQuery, capabilityQuery);
    return this.db.query(query, { model: this.model }).then(result => aggregateSearch(result));
  }

  associationsFromIncludes(includes) {
    let includeModels = [];

    for (const association of includes) {
      if (this.associations[association]) includeModels.push(this.associations[association]);
    }

    return includeModels;
  }

  attributes() {
    let rawAttributes = this.model.rawAttributes;
    return Object.keys(rawAttributes).map(fieldName => `${this.tableName}.${rawAttributes[fieldName].field} AS ${fieldName}`).join(', ');
  }
};

let businessPartnerWithAssociations = function(businessPartner)
{
  if (!businessPartner) return businessPartner;

  businessPartner.dataValues.contacts = businessPartner.BusinessPartnerContacts;
  businessPartner.dataValues.addresses = businessPartner.BusinessPartnerAddresses;
  businessPartner.dataValues.bankAccounts = businessPartner.BusinessPartnerBankAccounts;
  businessPartner.dataValues.capabilities = businessPartner.BusinessPartnerCapabilities;

  delete businessPartner.dataValues.BusinessPartnerContacts;
  delete businessPartner.dataValues.BusinessPartnerAddresses;
  delete businessPartner.dataValues.BusinessPartnerBankAccounts;
  delete businessPartner.dataValues.BusinessPartnerCapabilities;

  return businessPartner.dataValues;
}

let hierarchyQuery = function(hierarchyId)
{
  return [
    { hierarchyId: { $like: `%|${hierarchyId}` } },
    { hierarchyId: { $like: `${hierarchyId}|%` } },
    { hierarchyId: { $like: `%|${hierarchyId}|%` } },
    { hierarchyId: { $eq: hierarchyId } }
  ];
}

let aggregateSearch = function(businessPartners)
{
  const businessPartnersById = businessPartners.reduce((accumulator, businessPartner) => {
    const object = businessPartner.dataValues;
    if (!accumulator[object.id]) {
      accumulator[object.id] = JSON.parse(JSON.stringify(object));
      accumulator[object.id].capabilities = [];
      delete accumulator[object.id].capabilityId;
    }

    if (object.capabilityId) accumulator[object.id].capabilities.push(object.capabilityId);
    return accumulator;
  }, {});

  return Object.values(businessPartnersById);
}

let determineWhere = function(searchValue, matchQuery, typeQuery, capabilityQuery)
{
  let resultQuery = '';

  if (searchValue) {
    resultQuery += matchQuery;
    if (typeQuery) resultQuery += ` AND ${typeQuery}`;
    if (capabilityQuery) resultQuery += ` AND ${capabilityQuery}`;
    return resultQuery;
  }

  if (typeQuery) {
    resultQuery += `WHERE ${typeQuery}`;
    if (capabilityQuery) resultQuery += ` AND ${capabilityQuery}`;
    return resultQuery;
  }

  if (capabilityQuery) resultQuery += `WHERE ${capabilityQuery}`;

  return resultQuery;
};

module.exports = BusinessPartner;
