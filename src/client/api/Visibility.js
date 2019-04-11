import ApiBase from './ApiBase';

class Visibility extends ApiBase {
  find(businessPartnerId) {
    return this.ajax.get(`${this.urlPath}/${businessPartnerId}/visibility`).
      set('Accept', 'application/json').then(response => response.body);
  }

  createOrUpdate(businessPartnerId, visibility) {
    return this.ajax.put(`${this.urlPath}/${businessPartnerId}/visibility`).
      set('Accept', 'application/json').send(visibility).then(response => response.body);
  }
};

export default Visibility;
