import ApiBase from './ApiBase';

class BusinessLink extends ApiBase {
  constructor() {
    super();
    this.urlPath = '/business-partner/api';
  }

  all(query) {
    return this.ajax.get(`${this.urlPath}/business-links`).query(query || {}).set('Accept', 'application/json').
      then(response => response.body);
  }

  allForSupplierId(supplierId, queryParams = {}) {
    return this.ajax.get(`${this.urlPath}/suppliers/${supplierId}/business-links`).
    set('Accept', 'application/json').query(queryParams).then(response => response.body);
  }

  allForCustomerId(customerId, queryParams = {}) {
    return this.ajax.get(`${this.urlPath}/customers/${customerId}/business-links`).
    set('Accept', 'application/json').query(queryParams).then(response => response.body);
  }

  exists(supplierId, customerId) {
    return this.ajax.get(`${this.urlPath}/suppliers/${supplierId}/customers/${customerId}/business-links`).
      set('Accept', 'application/json').then(response => response.body.length > 0);
  }

  create(businessLink) {
    return this.ajax.post(`${this.urlPath}/business-links`).set('Accept', 'application/json').
      send(businessLink).then(response => response.body);
  }

  update(businessLink) {
    return this.ajax.put(`${this.urlPath}/business-links/${businessLink.id}`).set('Accept', 'application/json').
      send(businessLink).then(response => response.body);
  }

  updateSupplierConnection(supplierId, connectionId, attributes) {
    return this.ajax.put(`${this.urlPath}/suppliers/${supplierId}/business-link-connections/${connectionId}`).
      set('Accept', 'application/json').send(attributes).then(response => response.body);
  }

  updateCustomerConnection(customerId, connectionId, attributes) {
    return this.ajax.put(`${this.urlPath}/customers/${customerId}/business-link-connections/${connectionId}`).
      set('Accept', 'application/json').send(attributes).then(response => response.body);
  }
};

export default BusinessLink;
