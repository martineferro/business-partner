class UserData {
  constructor(req) {
    this.roles = req.opuscapita.userData('roles');
    this.id = req.opuscapita.userData('id') || 'No user';
    this.businessPartnerId = null; // NOTE! MUST BE CHANGED!!
    this.supplierId = req.opuscapita.userData('supplierId');
    this.customerId = req.opuscapita.userData('customerId');
  }

  hasAdminRole() {
    if (!this.roles) return false;

    return this.roles.some(rol => rol === 'admin' || rol.match('svc_'));
  }

  hasSupplierRole() {
    if (!this.roles) return false;

    return this.roles.some(rol => rol.match('supplier'));
  }
};

module.exports = UserData;
