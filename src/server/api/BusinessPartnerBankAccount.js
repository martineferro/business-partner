const uniqueIdentifier = require('../utils/validators/uniqueIdentifier');

class BusinessPartnerBankAccount {
  constructor(db) {
    this.model = db.models.BusinessPartnerBankAccount;
  }

  all(businessPartnerId) {
    return this.model.findAll({ where: { businessPartnerId: businessPartnerId } });
  }

  find(businessPartnerId, bankAccountId) {
    return this.model.findOne({ where: { businessPartnerId: businessPartnerId, id: bankAccountId } });
  }

  create(bankAccount) {
    normalize(bankAccount);
    [ 'id', 'createdOn', 'updatedOn' ].forEach(key => delete bankAccount[key]);
    return this.model.create(bankAccount);
  }

  update(businessPartnerId, bankAccountId, bankAccount) {
    normalize(bankAccount);
    [ 'id', 'businessPartnerId', 'createdOn' ].forEach(key => delete bankAccount[key]);
    return this.model.update(bankAccount, { where: { id: bankAccountId } }).then(() => {
      return this.find(businessPartnerId, bankAccountId);
    });
  }

  delete(businessPartnerId, bankAccountId) {
    let deleteQuery = { businessPartnerId: businessPartnerId };
    if (bankAccountId) deleteQuery.id = bankAccountId;
    return this.model.destroy({ where: deleteQuery }).then(() => null);
  }

  exists(businessPartnerId, bankAccountId) {
    return this.find(businessPartnerId, bankAccountId).then(accounts => Boolean(accounts));
  }

  hasUniqueIdentifier(bankAccount) {
    const fields = [
      bankAccount.accountNumber,
      bankAccount.bankgiro,
      bankAccount.plusgiro
    ];

    if (uniqueIdentifier.isValid(fields)) return true;

    return false;
  }
};

let normalize = function(bankAccount)
{
  for (const fieldName of ['accountNumber', 'bankIdentificationCode', 'bankCode']) {
    if (bankAccount[fieldName]) bankAccount[fieldName] = bankAccount[fieldName].replace(/\W+/g, '');
  }
};

module.exports = BusinessPartnerBankAccount;
