export default class BusinessPartnerAccessRequest {
  static get REQUESTED() { return 'requested'; }
  static get APPROVED() { return 'approved'; }
  static get REJECTED() { return 'rejected'; }

  constructor(request) {
    this.id = request.id;
    this.userId = request.userId;
    this.firstName = request.user && request.user.firstName;
    this.lastName = request.user && request.user.lastName;
    this.email = request.user && request.user.email;
    this.date = request.createdOn;
    this.comment = request.accessReason;
    this.status = request.status;
  }
};
