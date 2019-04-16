class BusinessLink {
  static get CONNECTION() {
    return { INVOICE: 'invoice', ORDER: 'order', CATALOG: 'catalog', GOODS: 'goods', RFQ: 'rfq' };
  }

  static get STATUS() {
    return { INVITED: 'invited', CONNECTED: 'connected', REJECTED: 'rejected' };
  }

  static get CONNECTION_TYPES() {
    return Object.values(this.CONNECTION);
  }

  static get STATUSES() {
    return Object.values(this.STATUS);
  }
};

module.exports = BusinessLink;
