class BusinessPartner
{
  static get SUPPLIER() { return 'supplier'; }
  static get CUSTOMER() { return 'customer'; }

  constructor(bp) {
    this.type = determineType(bp);
  }

  get otherType() {
    if (this.type === BusinessPartner.SUPPLIER) return BusinessPartner.CUSTOMER;

    if (this.type === BusinessPartner.CUSTOMER) return BusinessPartner.SUPPLIER;

    return null;
  }
};

let determineType = function(bPartner)
{
  if (bPartner.isSupplier) return BusinessPartner.SUPPLIER;

  if (bPartner.isCustomer) return BusinessPartner.CUSTOMER;

  return null;
};

module.exports = BusinessPartner;
