class BusinessPartner
{
  static get SUPPLIER() { return 'supplier'; }
  static get CUSTOMER() { return 'customer'; }

  static get typeByPrefix() {
    return { c_: this.CUSTOMER, s_: this.SUPPLIER };
  }

  static determine(supplierOrCustomerId)
  {
    const prefix = supplierOrCustomerId.substr(0, 2);

    return { id: supplierOrCustomerId.substr(2), type: BusinessPartner.typeByPrefix[prefix] };
  }
}

module.exports = BusinessPartner;
