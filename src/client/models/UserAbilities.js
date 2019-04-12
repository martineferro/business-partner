import abilities from '../data/userAbilities';

class UserAbilities {
  constructor(roles) {
    if (roles.includes('admin')) {
      this.abilitiesForRole = abilities['admin'];
    } else if (roles.includes('supplier-admin') || roles.includes('customer-admin')) {
      this.abilitiesForRole = abilities['business-partner-admin'];
    } else {
      this.abilitiesForRole = abilities['business-partner'];
    }
  }

  canCreateBusinessPartner() {
    return this.abilitiesForRole['business-partner']['actions'].includes('create');
  }

  canEditBusinessPartner() {
    return this.abilitiesForRole['business-partner']['actions'].includes('edit');
  }

  canCreateBankAccount() {
    return this.abilitiesForRole['bankAccount']['actions'].includes('add');
  }

  canCreateAddress() {
    return this.abilitiesForRole['address']['actions'].includes('add');
  }

  actionGroupForContacts(isLinkedUser) {
    if (isLinkedUser) return this._removeAddAction(this.abilitiesForRole['contact']['linkedUser']['actions']);

    return this._removeAddAction(this.abilitiesForRole['contact']['unlinkedUser']['actions']);
  }

  actionGroupForAddresses() {
    return this._removeAddAction(this.abilitiesForRole['address']['actions']);
  }

  actionGroupForBankAccounts() {
    return this._removeAddAction(this.abilitiesForRole['bankAccount']['actions']);
  }

  _removeAddAction(actions) {
    return actions.reduce((accumulator, action) => {
      if (action !== 'add') return accumulator.concat(action);

      return accumulator;
    }, []);
  }
}

export default UserAbilities;
