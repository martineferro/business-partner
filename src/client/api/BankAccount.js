import ApiBase from './ApiBase';

class BankAccount extends ApiBase {
  all(businessPartnerId) {
    return this.ajax.get(`${this.urlPath}/${businessPartnerId}/bank-accounts`).
      set('Accept', 'application/json').then(response => response.body);
  }

  create(businessPartnerId, bankAccount) {
    return this.ajax.post(`${this.urlPath}/${businessPartnerId}/bank-accounts`).
      set('Accept', 'application/json').send(bankAccount).then(response => response.body);
  }

  update(businessPartnerId, bankAccountId, bankAccount) {
    return this.ajax.put(`${this.urlPath}/${businessPartnerId}/bank-accounts/${bankAccountId}`).
      set('Accept', 'application/json').send(bankAccount).then(response => response.body);
  }

  delete(businessPartnerId, bankAccountId) {
    return this.ajax.del(`${this.urlPath}/${businessPartnerId}/bank-accounts/${bankAccountId}`).
      set('Accept', 'application/json')
  }

  exists(queryParams) {
    return this.ajax.get(`${this.urlPath}/bank-accounts/exists`).set('Accept', 'application/json').
      query(queryParams).then(response => response.body);
  }
}

export default BankAccount;
