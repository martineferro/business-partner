const SqlString = require('sequelize/lib/sql-string');
const utils = require('../utils/lib');
const uniqueIdentifier = require('../utils/validators/uniqueIdentifier');

class BusinessPartner {
  constructor(db) {
    this.db = db;
    this.model = db.models.BusinessPartner;
    this.tableName = this.model.tableName;
    this.capabilityTableName = db.models.BusinessPartnerCapability.tableName;

    const options = { foreignKey: 'businessPartnerId', sourceKey: 'id' };

    this.model.hasMany(db.models.BusinessPartnerContact, { as: 'contacts', ...options });
    this.model.hasMany(db.models.BusinessPartnerAddress, { as: 'addresses', ...options });
    this.model.hasMany(db.models.BusinessPartnerBankAccount, { as: 'bankAccounts', ...options });
    this.model.hasMany(db.models.BusinessPartnerCapability, { as: 'capabilities', ...options });

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
    if (query.commercialRegisterNo) queryObj.commercialRegisterNo = query.commercialRegisterNo;
    if (query.vatIdentificationNo) queryObj.vatIdentificationNo = query.vatIdentificationNo;
    if (query.globalLocationNo) queryObj.globalLocationNo = query.globalLocationNo;
    if (query.dunsNo) queryObj.dunsNo = query.dunsNo;
    if (query.ovtNo) queryObj.ovtNo = query.ovtNo;
    if (query.isCustomer) queryObj.isCustomer = Boolean(query.isCustomer);
    if (query.isSupplier) queryObj.isSupplier = Boolean(query.isSupplier);

    const includeModels = this.associationsFromIncludes(includes || []);

    const businessPartners = await this.model.findAll({ where: queryObj, include: includeModels });

    return businessPartners.map(businessPartner => businessPartner && businessPartner.dataValues);
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

  async find(id, includes) {
    const includeModels = this.associationsFromIncludes(includes || []);

    const businessPartner = await this.model.findOne({ where: { id: id }, include: includeModels });

    return businessPartner && businessPartner.dataValues;
  }

  async findMother(businessPartnerId) {
    const businessPartner = await this.find(businessPartnerId);
    if (!businessPartner) return Promise.resolve(null);

    const motherId = businessPartner.hierarchyId ? businessPartner.hierarchyId.split('|')[0] : businessPartner.id;
    return this.find(motherId);
  }

  async create(businessPartner) {
    normalize(businessPartner);
    [ 'createdOn', 'updatedOn' ].forEach(key => delete businessPartner[key]);

    if (businessPartner.parentId) {
      const parent = await this.find(businessPartner.parentId);
      businessPartner.hierarchyId = hierarchyIdFromParent(businessPartner.parentId, parent.hierarchyId);
    }

    const self = this;
    let businessPartnerId = businessPartner.id || extractIdFromName(businessPartner.name);

    function generateId(id) {
      if (id === businessPartner.id) return Promise.resolve(id);

      return self.find(id).then(bp => {
        if (bp) return generateId(businessPartnerId + utils.randomNumber());

        return id;
      });
    }

    return generateId(businessPartnerId).then(id => {
      businessPartner.id = id;
      return this.model.create(businessPartner);
    });
  }

  async update(businessPartnerId, businessPartner) {
    [ 'id', 'createdBy', 'createdOn', 'updatedOn' ].forEach(key => delete businessPartner[key]);

    normalize(businessPartner);

    if (businessPartner.parentId) {
      const parent = await this.find(businessPartner.parentId);
      businessPartner.hierarchyId = hierarchyIdFromParent(businessPartner.parentId, parent.hierarchyId);
    } else {
      businessPartner.hierarchyId = null;
    }

    let children = await this.all({ hierarchyId: businessPartnerId });

    let self = this;
    return this.model.update(businessPartner, { where: { id: businessPartnerId } }).then(() => {
      return Promise.all(children.map(child => {
        const hierarchyId = hierarchyIdForChild(businessPartnerId, businessPartner.hierarchyId, child.hierarchyId);
        return this.model.update({ hierarchyId: hierarchyId }, { where: { id : child.id } });
      })).then(() => self.find(businessPartnerId));
    });
  }

  delete(businessPartnerId) {
    return this.model.destroy({ where: { id: businessPartnerId } }).then(() => null);
  }

  async searchRecord(query) {
    normalize(query);

    let dbQuery = {};

    if (query.id) dbQuery.id = query.id;
    if (query.name) dbQuery.name = { $like: `%${query.name}%` };
    if (query.isCustomer) dbQuery.isCustomer = query.isCustomer;
    if (query.isSupplier) dbQuery.isSupplier = query.isSupplier;
    if (query.vatIdentificationNo) dbQuery.vatIdentificationNo = query.vatIdentificationNo;
    if (query.dunsNo) dbQuery.dunsNo = query.dunsNo;
    if (query.ovtNo) dbQuery.ovtNo = query.ovtNo;
    if (query.globalLocationNo) dbQuery.globalLocationNo = query.globalLocationNo;
    if (query.commercialRegisterNo) {
      dbQuery.$and = {
        commercialRegisterNo: query.commercialRegisterNo,
        cityOfRegistration: { $like: `%${query.cityOfRegistration}%` },
        countryOfRegistration: query.countryOfRegistration
      };
    }

    if (query.taxIdentificationNo) {
      dbQuery.$and = {
        taxIdentificationNo: query.taxIdentificationNo,
        cityOfRegistration: { $like: `%${query.cityOfRegistration}%` }
      };
    }

    if (Object.keys(dbQuery).length > 0) dbQuery = { $or: [dbQuery] };

    if (query.businessPartnerId) dbQuery.id = { $ne: query.businessPartnerId };
    if (query.entityCode) dbQuery.entityCode = query.entityCode;
    if (query.parentId) {
      const motherCustomer = await this.findMother(query.parentId);
      if (motherCustomer) {
        if (query.notEqual) {
          dbQuery.id = dbQuery.id ? { $and: [dbQuery.id, { $ne: motherCustomer.id }] } : { $ne: motherCustomer.id };
          dbQuery.hierarchyId = { $or: [{ $eq: null }, { $notLike: `%${motherCustomer.id}%` }] };
        } else {
          dbQuery.hierarchyId = { $like: `%${motherCustomer.id}%` };
        }
      }
    }

    return this.model.findOne({ where: dbQuery });
  }

  recordExists(businessPartner) {
    return this.searchRecord(businessPartner).then(businessPartner => Boolean(businessPartner));
  }

  associationsFromIncludes(includes) {
    let includeModels = [];

    for (const asn of includes) {
      if (this.associations[asn]) includeModels.push({ model: this.associations[asn], as: asn });
    }

    return includeModels;
  }

  attributes() {
    let rawAttributes = this.model.rawAttributes;
    return Object.keys(rawAttributes).map(fieldName => `${this.tableName}.${rawAttributes[fieldName].field} AS ${fieldName}`).join(', ');
  }

  hasUniqueIdentifier(businessPartner) {
    const fields = [
      businessPartner.vatIdentificationNo,
      businessPartner.dunsNo,
      businessPartner.globalLocationNo,
      businessPartner.ovtNo,
      businessPartner.iban
    ];

    if (uniqueIdentifier.isValid(fields)) return true;

    return false;
  }
};

let normalize = function(businessPartner)
{
  for (const fieldName of ['vatIdentificationNo', 'dunsNo', 'iban']) {
    if (businessPartner[fieldName]) businessPartner[fieldName] = businessPartner[fieldName].replace(/\s+/g, '');
  }
  for (const fieldName of ['name', 'commercialRegisterNo', 'cityOfRegistration', 'taxIdentificationNo']) {
    if (businessPartner[fieldName]) businessPartner[fieldName] = businessPartner[fieldName].trim();
  }
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
      accumulator[object.id] = { ...object };
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

let hierarchyIdFromParent = function(parentId, parentHierarchyId)
{
  if (!parentHierarchyId) return parentId;

  return [parentHierarchyId, parentId].join('|');
}

let hierarchyIdForChild = function(businessPartnerId, hierarchyId, childHierarchyId)
{
  let hierarchyIds = childHierarchyId.split('|');
  let slicedChildHierarchyId = hierarchyIds.slice(hierarchyIds.indexOf(businessPartnerId)).join('|');

  if (!hierarchyId) return slicedChildHierarchyId;

  return [hierarchyId, slicedChildHierarchyId].join('|');
}

let extractIdFromName = function(name)
{
  if (!name) return null;

  return name.replace(/^[0-9\W]+|[^0-9a-z-_]/gi, '').slice(0, 27);
}

module.exports = BusinessPartner;
