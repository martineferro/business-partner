export default class BusinessPartnerVisibility {
  static get PUBLIC() { return 'public'; }
  static get PRIVATE() { return 'private'; }
  static get BUSINESS_PARTNERS() { return 'businessPartners'; }
  static get TYPES() { return [this.PUBLIC, this.PRIVATE, this.BUSINESS_PARTNERS]; }
};
