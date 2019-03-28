class BusinessPartnerCapability {
  constructor(db) {
    this.model = db.models.BusinessPartnerCapability;
  }

  create(businessPartnerId, capabilityId, createdBy) {
    let qry = query(businessPartnerId, capabilityId);
    qry.defaults = { createdBy: createdBy };
    return this.model.findOrCreate(qry).spread((capability, created) => capability);
  }

  delete(businessPartnerId, capabilityId) {
    return this.model.destroy(query(businessPartnerId, capabilityId)).then(() => null);
  }
};

let query = function(businessPartnerId, capabilityId)
{
  let dbQuery = { businessPartnerId: businessPartnerId };
  if (capabilityId) dbQuery.capabilityId = capabilityId;
  return { where: dbQuery };
}

module.exports = BusinessPartnerCapability;
