import ApiBase from './ApiBase';

class Contact extends ApiBase {
  getContacts(supplierId) {
    return this.ajax.get(`/supplier/api/suppliers/${supplierId}/contacts`).
      set('Accept', 'application/json').then(response => response.body);
  }

  createContact(supplierId, contact) {
    return this.ajax.post(`/supplier/api/suppliers/${supplierId}/contacts`).
      set('Accept', 'application/json').send(contact).then(response => response.body);
  }

  createUser(supplierId, contact) {
    return this.ajax.post(`/supplier/api/suppliers/${supplierId}/contacts/createUser`).
      set('Accept', 'application/json').send(contact).then(response => response.body);
  }

  updateContact(supplierId, contactId, contact) {
    return this.ajax.put(`/supplier/api/suppliers/${supplierId}/contacts/${contactId}`).
      set('Accept', 'application/json').send(contact).then(response => response.body);
  }

  deleteContact(supplierId, contactId) {
    return this.ajax.del(`/supplier/api/suppliers/${supplierId}/contacts/${contactId}`).
      set('Accept', 'application/json')
  }
}

export default Contact;
