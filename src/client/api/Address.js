import ApiBase from './ApiBase';

class Address extends ApiBase {
  all(businessPartnerId) {
    return this.ajax.get(`${this.urlPath}/${businessPartnerId}/addresses`).
      set('Accept', 'application/json').then(response => response.body);
  }

  create(businessPartnerId, address) {
    return this.ajax.post(`${this.urlPath}/${businessPartnerId}/addresses`).
      set('Accept', 'application/json').send(address).then(response => response.body);
  }

  update(businessPartnerId, addressId, address) {
    return this.ajax.put(`${this.urlPath}/${businessPartnerId}/addresses/${addressId}`).
      set('Accept', 'application/json').send(address).then(response => response.body);
  }

  delete(businessPartnerId, addressId) {
    return this.ajax.del(`${this.urlPath}/${businessPartnerId}/addresses/${addressId}`).
      set('Accept', 'application/json')
  }
}

export default Address;
