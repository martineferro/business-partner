export default class BusinessPartnerAddress {
  static get DEFAULT() { return 'default'; }
  static get INVOICE() { return 'invoice'; }
  static get RMA() { return 'rma'; }
  static get PLANT() { return 'plant'; }
  static get DELIVERY() { return 'delivery'; }
  static get TYPES() { return [this.DEFAULT, this.INVOICE, this.RMA, this.PLANT, this.DELIVERY]; }
};
