import ApiBase from './ApiBase';

class BankAccount extends ApiBase {
  constructor() {
    super();
    this.urlPath = 'business-partner/api/business-partners';
  }

  getBankAccounts(supplierId) {
    return this.ajax.get(`${this.urlPath}/${supplierId}/bank_accounts`).
      set('Accept', 'application/json').then(response => response.body);
  }

  createBankAccount(supplierId, bankAccount) {
    return this.ajax.post(`${this.urlPath}/${supplierId}/bank_accounts`).
      set('Accept', 'application/json').send(bankAccount).then(response => response.body);
  }

  updateBankAccount(supplierId, bankAccountId, bankAccount) {
    return this.ajax.put(`${this.urlPath}/${supplierId}/bank_accounts/${bankAccountId}`).
      set('Accept', 'application/json').send(bankAccount).then(response => response.body);
  }

  deleteBankAccount(supplierId, bankAccountId) {
    return this.ajax.del(`${this.urlPath}/${supplierId}/bank_accounts/${bankAccountId}`).
      set('Accept', 'application/json')
  }
}

export default BankAccount;
