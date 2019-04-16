export default class BusinessPartnerAddress {
  static get DEFAULT() { return 'default'; }
  static get SALES() { return 'sales'; }
  static get ESCALATION() { return 'escalation'; }
  static get PRODUCT() { return 'product'; }
  static get TECHNICAL() { return 'technical'; }
  static get MANAGEMENT() { return 'management'; }
  static get LOGISTICS() { return 'logistics'; }
  static get ACCOUNTING() { return 'accounting'; }
  static get SUPPORT() { return 'support'; }
  static get IT() { return 'it'; }
  static get OTHERS() { return 'others'; }

  static get TYPES() {
    return [this.DEFAULT, this.SALES, this.ESCALATION, this.PRODUCT, this.TECHNICAL];
  }
  static get DEPARTMENTS() {
    return [
      this.MANAGEMENT,
      this.SALES,
      this.LOGISTICS,
      this.ACCOUNTING,
      this.SUPPORT,
      this.IT,
      this.OTHERS
    ];
  }
};
