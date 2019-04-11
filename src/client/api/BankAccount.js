import ApiBase from './ApiBase';

class BankAccount extends ApiBase {
  all(businessPartnerId) {
    return this.ajax.get(`${this.urlPath}/${businessPartnerId}/bank_accounts`).
      set('Accept', 'application/json').then(response => response.body);
  }

  create(businessPartnerId, bankAccount) {
    return this.ajax.post(`${this.urlPath}/${businessPartnerId}/bank_accounts`).
      set('Accept', 'application/json').send(bankAccount).then(response => response.body);
  }

  update(businessPartnerId, bankAccountId, bankAccount) {
    return this.ajax.put(`${this.urlPath}/${businessPartnerId}/bank_accounts/${bankAccountId}`).
      set('Accept', 'application/json').send(bankAccount).then(response => response.body);
  }

  delete(businessPartnerId, bankAccountId) {
    return this.ajax.del(`${this.urlPath}/${businessPartnerId}/bank_accounts/${bankAccountId}`).
      set('Accept', 'application/json')
  }
}

export default BankAccount;
