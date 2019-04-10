import ApiBase from './ApiBase';
import BusinessPartnerAccessRequest from '../models/BusinessPartnerAccessRequest';

class Access extends ApiBase {
  constructor() {
    super();
    this.urlPath = '/business-partner/api';
  }

  all(businessPartnerId) {
    const queryParams = { businessPartnerId: businessPartnerId, include: 'user' };
    return this.ajax.get(`${this.urlPath}/business-partner-access`).query(queryParams).
      set('Accept', 'application/json').then(response => {
        return response.body.map(accessRequest => result(accessRequest));
      });
  }

  get(userId) {
    return this.ajax.get(`${this.urlPath}/business-partner-access/${userId}`).
      set('Accept', 'application/json').then(res => result(res.body));
  }

  create(access) {
    return this.ajax.post(`${this.urlPath}/business-partner-access`).
      set('Accept', 'application/json').send(access).then(response => result(response.body));
  }

  approve(id, userId) {
    return this.ajax.put(`${this.urlPath}/business-partner-access/${id}`).
      set('Accept', 'application/json').send({ userId: userId, status: 'approved' }).then(res => result(res.body));
  }

  reject(id, userId) {
    return this.ajax.put(`${this.urlPath}/business-partner-access/${id}`).
      set('Accept', 'application/json').send({ userId: userId, status: 'rejected' }).then(res => result(res.body));
  }

  grant(access) {
    return this.ajax.put(`${this.urlPath}/grant-business-partner-access`).
      set('Accept', 'application/json').send(access).then(res => result(res.body));
  }
}

let result = function(accessRequest)
{
  return new BusinessPartnerAccessRequest(accessRequest);
};

export default Access;
