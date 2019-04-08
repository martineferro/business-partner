import ApiBase from './ApiBase';

class Access extends ApiBase {
  constructor() {
    super();
    this.urlPath = '/business-partner/api';
  }

  all(businessPartnerId) {
    const queryParams = { businessPartnerId: businessPartnerId, include: 'user' };
    return this.ajax.get(`${this.urlPath}/business-partner-access`).query(queryParams).
      set('Accept', 'application/json').then(response => {
        return response.body.map(accessRequest => {
          return {
            id: accessRequest.id,
            userId: accessRequest.userId,
            firstName: accessRequest.user.firstName,
            lastName: accessRequest.user.lastName,
            email: accessRequest.user.email,
            date: accessRequest.createdOn,
            comment: accessRequest.accessReason,
            status: accessRequest.status
          };
        });
      });
  }

  get(userId) {
    return this.ajax.get(`${this.urlPath}/business-partner-access/${userId}`).
      set('Accept', 'application/json').then(res => res.body);
  }

  create(access) {
    return this.ajax.post(`${this.urlPath}/business-partner-access`).
      set('Accept', 'application/json').send(access).then(response => response.body);
  }

  approve(id, userId) {
    return this.ajax.put(`${this.urlPath}/business-partner-access/${id}`).
      set('Accept', 'application/json').send({ userId: userId, status: 'approved' }).then(response => response.body);
  }

  reject(id, userId) {
    return this.ajax.put(`${this.urlPath}/business-partner-access/${id}`).set('Accept', 'application/json').
      send({ userId: userId, status: 'rejected' }).then(response => response.body);
  }

  grant(access) {
    return this.ajax.put(`${this.urlPath}/grant-business-partner-access`).
      set('Accept', 'application/json').send(access).then(res => res.body);
  }
}

export default Access;
