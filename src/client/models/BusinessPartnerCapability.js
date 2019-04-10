export default class BusinessPartnerVisibility {
  static get INVOICE_SEND() { return 'eInvoice-send'; }
  static get ORDER() { return 'order'; }
  static get CATALOG() { return 'catalog'; }
  static get FULFILLMENT() { return 'fulfillment'; }
  static get TYPES() {
    return [this.INVOICE_SEND, this.ORDER, this.CATALOG, this.FULFILLMENT];
  }
};
