import React, { PropTypes } from 'react';
import locales from '../../../i18n';
import validationLocales from '../../../utils/validatejs/i18n';
import Table from '../../Table.react';
import { BankAccount } from '../../../api';
import { Components } from '@opuscapita/service-base-ui';
import Form from './Form.react';
import View from './View.react';
import CountryView from '../../CountryView.react';
import ActionButton from '../../ActionButton.react';
import UserAbilities from '../../../models/UserAbilities';
import ErrorView from '../../ErrorView.react';

export default class Details extends Components.ContextComponent  {
  static propTypes = {
    businessPartnerId: React.PropTypes.string.isRequired,
    onUnauthorized: React.PropTypes.func
  };

  constructor(props, context) {
    super(props);

    this.state = { bankAccounts: [], bankAccount: null, loading: true, loadErrors: false };

    this.accountApi = new BankAccount();
    this.userAbilities = new UserAbilities(context.userData.roles);
    this.actionModal = null;
    this.viewModal = null;
    this.deleteModal = null;
    this.bankAccountForm = null;
  }

  componentWillMount() {
    this.context.i18n.register('BusinessPartnerValidatejs', validationLocales);
    this.context.i18n.register('BusinessPartner', locales);
  }

  componentDidMount() {
    return this.accountApi.all(this.props.businessPartnerId).then(bankAccounts => {
      this.setState({ bankAccounts: bankAccounts, loading: false });
    }).catch(errors => {
      if (errors.status === 401) {
        this.props.onUnauthorized();
        return;
      }

      this.setState({ loading: false, loadErrors: true });
    });
  }

  componentWillReceiveProps(newProps, nextContext) {
    if(nextContext.i18n){
      nextContext.i18n.register('BusinessPartnerValidatejs', validationLocales);
      nextContext.i18n.register('BusinessPartner', locales);
    }
  }

  addShowModal(event) {
    event.preventDefault();

    const title = this.context.i18n.getMessage('BusinessPartner.BankAccount.add');
    this.handleShowActionModal('add', null, title);
  }

  editShowModal(event, bankAccount) {
    event.preventDefault();

    const title = this.context.i18n.getMessage('BusinessPartner.BankAccount.edit');
    this.handleShowActionModal('edit', bankAccount, title);
  }

  async viewShowModal(event, bankAccount) {
    event.preventDefault();

    await this.setState({ bankAccount: bankAccount });

    const title = this.context.i18n.getMessage('BusinessPartner.BankAccount.view');
    const buttons = { 'close': this.context.i18n.getMessage('BusinessPartner.Button.close') };
    const onButtonClick = () => this.viewModal.hide();

    this.viewModal.show(title, undefined, onButtonClick, buttons);
  }

  deleteShowModal(event, bankAccount) {
    event.preventDefault();

    const title = this.context.i18n.getMessage('BusinessPartner.BankAccount.delete');
    const message = this.context.i18n.getMessage('BusinessPartner.BankAccount.Confirmation.delete');
    const buttons = {
      'yes': this.context.i18n.getMessage('BusinessPartner.Button.yes'),
      'no': this.context.i18n.getMessage('BusinessPartner.Button.no')
    };

    const onButtonClick = (button) => {
      if (button === 'no') {
        this.deleteModal.hide();
      } else {
        this.deleteBankAccount(bankAccount).then(() => this.deleteModal.hide());
      }
    };

    this.deleteModal.show(title, message, onButtonClick, buttons);
  }

  async handleShowActionModal(action, bankAccount, title) {
    const { i18n } = this.context;

    await this.setState({ bankAccount: bankAccount });

    const buttons = {
      'save': i18n.getMessage('BusinessPartner.Button.save'),
      'close': i18n.getMessage('BusinessPartner.Button.close')
    };

    const success = () => {

    };

    const error = async (errors) => {
      await this.bankAccountForm.setFieldErrorsStates(errors);
      return false;
    };

    const onButtonClick = async (button) => {
      if (button === 'close') {
        this.actionModal.hide();
      } else {
        try {
          await this.bankAccountForm.validate();

          return this[`${action}BankAccount`](this.bankAccountForm.state.bankAccount).then(() => {
            this.actionModal.hide();
          });
        } catch(errors) {
          this.bankAccountForm.setFieldErrorsStates(errors);

          return false;
        }

      }
    };

    this.actionModal.show(title, undefined, onButtonClick, buttons);
  }

  addBankAccount(changedAccount) {
    return this.accountApi.create(this.props.businessPartnerId, changedAccount).then(account => {
      let bankAccounts = this.state.bankAccounts;
      bankAccounts.push(account);

      this.setState({ bankAccounts: bankAccounts, bankAccount: null });

      this.notify(this.context.i18n.getMessage('BusinessPartner.BankAccount.Message.saved'), 'info');
    }).catch(errors => {
      if (errors.status === 401) {
        this.props.onUnauthorized();
      } else {
        console.log(`Error during create BusinessParterBankAccount: ${errors.message}`);
        this.notify(this.context.i18n.getMessage('BusinessPartner.BankAccount.Message.saveFailed'), 'error');
      }
    });
  }

  editBankAccount(changedAccount) {
    return this.accountApi.update(this.props.businessPartnerId, changedAccount.id, changedAccount).then(account => {
      let bankAccounts = this.state.bankAccounts;
      const index = bankAccounts.findIndex(acc => acc.id === account.id);

      if (index === -1) {
        throw new Error(`Not found BusinessParterBankAccount by id [${account.id}]`);
      }
      bankAccounts[index] = account;

      this.setState({ bankAccounts: bankAccounts, bankAccount: null });

      this.notify(this.context.i18n.getMessage('BusinessPartner.BankAccount.Message.updated'), 'info');
    }).catch(errors => {
      if (errors.status === 401) return this.props.onUnauthorized();

      this.notify(this.context.i18n.getMessage('BusinessPartner.BankAccount.Message.updateFailed'), 'error');
    });
  }

  deleteBankAccount(bankAccount) {
    return this.accountApi.delete(this.props.businessPartnerId, bankAccount.id).then(() => {
      let bankAccounts = this.state.bankAccounts;
      const index = bankAccounts.findIndex(add => add.id === bankAccount.id);

      if (index === -1) {
        throw new Error(`Not found BusinessParterBankAccount by id [${bankAccount.id}]`);
      }
      bankAccounts.splice(index, 1);

      this.setState({ bankAccounts: bankAccounts, bankAccount: null });

      this.notify(this.context.i18n.getMessage('BusinessPartner.BankAccount.Message.deleted'), 'info');
    }).catch(errors => {
      if (errors.status === 401) return this.props.onUnauthorized();

      this.notify(this.context.i18n.getMessage('BusinessPartner.BankAccount.Message.deleteFailed'), 'error');
    });
  }

  notify(message, type) {
    if(this.context.showNotification) this.context.showNotification(message, type);
  }

  renderActions(bankAccount) {
    return (
      <div className='text-right'>
        {this.userAbilities.actionGroupForBankAccounts().map(action => {
          return  <ActionButton
                    key={action}
                    action={action}
                    onClick={event => this[`${action}ShowModal`](event, bankAccount)}
                    label={this.context.i18n.getMessage(`BusinessPartner.Button.${action}`)}
                    isSmall={true}
                    showIcon={true}
                  />
        })}
      </div>
    );
  }

  renderAddButton() {
    if (!this.userAbilities.canCreateBankAccount()) return null;

    return (
      <button
        className='btn btn-primary pull-right'
        onClick={event => this.addShowModal(event)}
      >
        {this.context.i18n.getMessage('BusinessPartner.Button.add')}
      </button>
    );
  }

  renderTable() {
    const columns = [
      {
        Header: this.context.i18n.getMessage('BusinessPartner.BankAccount.Label.bankName'),
        accessor: 'bankName',
        Cell: row => { return row.value || '-'; },
        style: { 'white-space': 'unset' }
      },
      {
        Header: this.context.i18n.getMessage('BusinessPartner.BankAccount.Label.accountNumber'),
        accessor: 'accountNumber',
        minWidth: 150
      },
      {
        Header: this.context.i18n.getMessage('BusinessPartner.BankAccount.Label.bankIdentificationCode'),
        accessor: 'bankIdentificationCode',
        Cell: row => { return row.value || '-'; },
        maxWidth: 120
      },
      {
        Header: this.context.i18n.getMessage('BusinessPartner.BankAccount.Label.bankCountryKey'),
        accessor: 'bankCountryKey',
        Cell: (row) => <CountryView countryId={row.value}/>,
        style: { 'white-space': 'unset' },
        maxWidth: 110
      },
      {
        Header: this.context.i18n.getMessage('BusinessPartner.BankAccount.Label.bankgiro'),
        accessor: 'bankgiro',
        Cell: row => { return row.value || '-'; },
        maxWidth: 110
      },
      {
        Header: this.context.i18n.getMessage('BusinessPartner.BankAccount.Label.plusgiro'),
        accessor: 'plusgiro',
        Cell: row => { return row.value || '-'; },
        maxWidth: 110
      },
      {
        Header: '',
        accessor: element => element,
        id: 'actions',
        Cell: row => this.renderActions(row.value),
        style: { 'white-space': 'unset' },
        minWidth: 150
      }];

    return <Table data={this.state.bankAccounts} columns={columns} loading={this.state.loading} defaultPageSize={5} />;
  }

  render() {
    if (this.state.loadErrors) return <ErrorView />;

    return (
      <div>
        {this.renderAddButton()}
        <h4 className='tab-description'>{this.context.i18n.getMessage('BusinessPartner.Heading.BankAccount')}</h4>
        {this.renderTable()}
        <Components.ModalDialog ref={node => this.actionModal = node} >
          <Form ref={ node => this.bankAccountForm = node } bankAccount={ this.state.bankAccount || {} } />
        </Components.ModalDialog>
        <Components.ModalDialog ref={node => this.viewModal = node} >
          <View bankAccount={ this.state.bankAccount || {} } />
        </Components.ModalDialog>
        <Components.ModalDialog ref={node => this.deleteModal = node} />
      </div>
    );
  }
};
