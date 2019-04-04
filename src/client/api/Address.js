import ApiBase from './ApiBase';

class Address extends ApiBase {
  getAddresses(supplierId) {
    return this.ajax.get(`/supplier/api/suppliers/${supplierId}/addresses`).
      set('Accept', 'application/json').then(response => response.body);
  }

  createAddress(supplierId, address) {
    return this.ajax.post(`/supplier/api/suppliers/${supplierId}/addresses`).
      set('Accept', 'application/json').send(address).then(response => response.body);
  }

  updateAddress(supplierId, addressId, address) {
    return this.ajax.put(`/supplier/api/suppliers/${supplierId}/addresses/${addressId}`).
      set('Accept', 'application/json').send(address).then(response => response.body);
  }

  deleteAddress(supplierId, addressId) {
    return this.ajax.del(`/supplier/api/suppliers/${supplierId}/addresses/${addressId}`).
      set('Accept', 'application/json')
  }
}

export default Address;
