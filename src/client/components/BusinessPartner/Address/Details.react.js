import React, { PropTypes } from 'react';
import locales from '../../../i18n';
import validationLocales from '../../../utils/validatejs/i18n';
import Table from '../../Table.react';
import { Address } from '../../../api';
import { Components } from '@opuscapita/service-base-ui';
import Form from './Form.react';
import CountryView from '../../CountryView.react';
import ActionButton from '../../ActionButton.react';
import UserAbilities from '../../../models/UserAbilities';
import UserData from '../../../models/UserData';
import ErrorView from '../../ErrorView.react';

export default class Details extends Components.ContextComponent  {
  static propTypes = {
    businessPartnerId: React.PropTypes.string.isRequired,
    onUnauthorized: React.PropTypes.func
  };

  constructor(props, context) {
    super(props);

    this.state = { addresses: [], address: null, loading: true, loadErrors: false };

    this.addressApi = new Address();
    this.userAbilities = new UserAbilities(context.userData.roles);
    this.userData = new UserData(context.userData);
    this.actionModal = null;
    this.viewModal = null;
    this.deleteModal = null;
    this.addressForm = null;
  }

  componentWillMount(){
    this.context.i18n.register('BusinessPartnerValidatejs', validationLocales);
    this.context.i18n.register('BusinessPartner', locales);
  }

  componentDidMount() {
    return this.addressApi.all(this.props.businessPartnerId).then(addresses => {
      this.setState({ addresses: addresses, loading: false });
    }).catch(errors => {
        if (errors.status === 401) {
          this.props.onUnauthorized();
          return;
        }

        this.setState({ loading: false, hasErrors: true });
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

    const title = this.context.i18n.getMessage('BusinessPartner.Address.add');
    this.handleShowActionModal('add', null, title);
  }

  editShowModal(event, address) {
    event.preventDefault();

    const title = this.context.i18n.getMessage('BusinessPartner.Address.edit');
    this.handleShowActionModal('edit', address, title);
  }

  deleteShowModal(event, address) {
    event.preventDefault();

    const title = this.context.i18n.getMessage('BusinessPartner.Address.delete');
    const message = this.context.i18n.getMessage('BusinessPartner.Address.Confirmation.delete');
    const buttons = {
      'yes': this.context.i18n.getMessage('BusinessPartner.Button.yes'),
      'no': this.context.i18n.getMessage('BusinessPartner.Button.no')
    };

    const onButtonClick = (button) => {
      if (button === 'no') {
        this.deleteModal.hide();
      } else {
        this.deleteAddress(address).then(() => this.deleteModal.hide());
      }
    };

    this.deleteModal.show(title, message, onButtonClick, buttons);
  }

  async handleShowActionModal(action, address, title) {
    const { i18n } = this.context;

    await this.setState({ address: address });

    const buttons = {
      'save': i18n.getMessage('BusinessPartner.Button.save'),
      'close': i18n.getMessage('BusinessPartner.Button.close')
    };

    const onButtonClick = (button) => {
      if (button === 'close') {
        this.actionModal.hide();
      } else {
        const errors = this.addressForm.validate();

        if (errors) return false;

        return this[`${action}Address`](this.addressForm.state.address).then(() => {
          this.actionModal.hide();
        });
      }
    };

    this.actionModal.show(title, undefined, onButtonClick, buttons);
  }

  addAddress(changedAddress) {
    return this.addressApi.create(this.props.businessPartnerId, changedAddress).then(address => {
      let addresses = this.state.addresses;
      addresses.push(address);

      this.setState({ addresses: addresses, address: null });

      this.notify(this.context.i18n.getMessage('BusinessPartner.Address.Messages.saved'), 'info');
    }).catch(errors => {
      if (errors.status === 401) {
        this.props.onUnauthorized();
      } else {
        console.log(`Error during create BusinessParterAddress: ${errors.message}`);
      }
    });
  }

  editAddress(changedAddress) {
    return this.addressApi.update(this.props.businessPartnerId, changedAddress.id, changedAddress).then(updatedAddress => {
      let addresses = this.state.addresses;
      const index = addresses.findIndex(address => address.id === updatedAddress.id);

      if (index === -1) {
        throw new Error(`Not found BusinessPartnerAddress by id [${updatedAddress.id}]`);
      }
      addresses[index] = updatedAddress;

      this.setState({ addresses: addresses, address: null });

      this.notify(this.context.i18n.getMessage('BusinessPartner.Address.Messages.updated'), 'info');
    }).catch(errors => {
      if (errors.status === 401) this.props.onUnauthorized();
    });
  }

  deleteAddress(address) {
    return this.addressApi.delete(this.props.businessPartnerId, address.id).then(() => {
      let addresses = this.state.addresses;
      const index = addresses.findIndex(add => add.id === address.id);

      if (index === -1) {
        throw new Error(`Not found BusinessPartnerAddress by id [${address.id}]`);
      }
      addresses.splice(index, 1);

      this.setState({ addresses: addresses, address: null });

      this.notify(this.context.i18n.getMessage('BusinessPartner.Address.Messages.deleted'), 'info');
    }).catch(errors => {
      if (errors.status === 401) {
        this.props.onUnauthorized();
      }
    });
  }

  notify(message, type) {
    if(this.context.showNotification) this.context.showNotification(message, type);
  }

  renderActions(address) {
    return (
      <div className='text-right'>
        {this.userAbilities.actionGroupForAddresses().map(action => {
          return  <ActionButton
                    key={action}
                    action={action}
                    onClick={event => this[`${action}ShowModal`](event, address)}
                    label={this.context.i18n.getMessage(`BusinessPartner.Button.${action}`)}
                    isSmall={true}
                    showIcon={true}
                  />
        })}
      </div>
    );
  }

  renderAddButton() {
    if (!this.userAbilities.canCreateAddress()) return null;

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
        Header: this.context.i18n.getMessage('BusinessPartner.Address.Label.type'),
        accessor: 'type',
        Cell: row => this.context.i18n.getMessage(`BusinessPartner.Address.Type.${row.value}`),
        maxWidth: 100
      },
      {
        Header: this.context.i18n.getMessage('BusinessPartner.Address.Label.street1'),
        accessor: 'street1',
        style: { 'white-space': 'unset' }
      },
      {
        Header: this.context.i18n.getMessage('BusinessPartner.Address.Label.zipCode'),
        accessor: 'zipCode',
        Cell: row => { return row.value || '-'; },
        maxWidth: 100
      },
      {
        Header: this.context.i18n.getMessage('BusinessPartner.Address.Label.city'),
        accessor: 'city'
      },
      {
        Header: this.context.i18n.getMessage('BusinessPartner.Address.Label.countryId'),
        accessor: 'countryId',
        Cell: (row) => <CountryView countryId={row.value}/>,
        style: { 'white-space': 'unset' },
        maxWidth: 120
      },
      {
        Header: this.context.i18n.getMessage('BusinessPartner.Address.Label.phoneNo'),
        accessor: 'phoneNo',
        maxWidth: 120
      },
      {
        Header: '',
        accessor: element => element,
        id: 'actions',
        Cell: row => this.renderActions(row.value),
        style: { 'white-space': 'unset' },
        minWidth: 120
      }];

    return <Table data={this.state.addresses} columns={columns} loading={this.state.loading} defaultPageSize={5} />;
  }

  render() {
    const { loadErrors } = this.state;

    if (loadErrors) return <ErrorView />;

    return (
      <div>
        {this.renderAddButton()}
        <h4 className='tab-description'>{this.context.i18n.getMessage('BusinessPartner.Heading.address')}</h4>
        {this.renderTable()}
        <Components.ModalDialog ref={node => this.actionModal = node} >
          <Form ref={ node => this.addressForm = node } address={ this.state.address || {} } />
        </Components.ModalDialog>
        <Components.ModalDialog ref={node => this.deleteModal = node} />
      </div>
    );
  }
};
