import ApiBase from './ApiBase';

class Contact extends ApiBase {
  constructor() {
    super();
    this.urlPath = '/business-partner/api/business-partners';
  }

  all(businessPartnerId) {
    return this.ajax.get(`${this.urlPath}/${businessPartnerId}/contacts`).
      set('Accept', 'application/json').then(response => response.body);
  }

  create(businessPartnerId, contact) {
    return this.ajax.post(`${this.urlPath}/${businessPartnerId}/contacts`).
      set('Accept', 'application/json').send(contact).then(response => response.body);
  }

  createUser(businessPartnerId, contact) {
    return this.ajax.post(`${this.urlPath}/${businessPartnerId}/contacts/createUser`).
      set('Accept', 'application/json').send(contact).then(response => response.body);
  }

  update(businessPartnerId, contactId, contact) {
    return this.ajax.put(`${this.urlPath}/${businessPartnerId}/contacts/${contactId}`).
      set('Accept', 'application/json').send(contact).then(response => response.body);
  }

  delete(businessPartnerId, contactId) {
    return this.ajax.del(`${this.urlPath}/${businessPartnerId}/contacts/${contactId}`).
      set('Accept', 'application/json')
  }
}

export default Contact;
