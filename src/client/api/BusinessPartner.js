import ApiBase from './ApiBase';

class BusinessPartner extends ApiBase {
  constructor() {
    super();
    this.urlPath = '/business-partner/api/business-partners';
  }

  find(businessPartnerId, queryParams) {
    return this.ajax.get(`${this.urlPath}/${businessPartnerId}`).set('Accept', 'application/json').
      query(queryParams || {}).then(response => response.body);
  }

  all(queryParams) {
    return this.ajax.get(`${this.urlPath}`).set('Accept', 'application/json').
      query(queryParams || {}).then(response => response.body);
  }

  organization(businessPartnerId) {
    return this.ajax.get(`${this.urlPath}/${businessPartnerId}/organization`).
      set('Accept', 'application/json').then(response => response.body);
  }

  create(businessPartner) {
    return this.ajax.post(`${this.urlPath}`).set('Accept', 'application/json').
      send(businessPartner).then(response => response.body);
  }

  update(businessPartnerId, businessPartner) {
    return this.ajax.put(`${this.urlPath}/${businessPartnerId}`).set('Accept', 'application/json').
      send(businessPartner).then(response => response.body);
  }

  search(queryParams) {
    return this.ajax.get(`${this.urlPath}/search`).set('Accept', 'application/json').
      query(queryParams).then(response => response.body);
  }

  exists(queryParams) {
    return this.ajax.get(`${this.urlPath}/exists`).set('Accept', 'application/json').
      query(queryParams).then(response => response.body);
  }

  profileStrength(businessPartnerId) {
    return this.ajax.get(`${this.urlPath}/${businessPartnerId}/profile-strength`).
      set('Accept', 'application/json').then(response => response.body);
  }
}

export default BusinessPartner;
