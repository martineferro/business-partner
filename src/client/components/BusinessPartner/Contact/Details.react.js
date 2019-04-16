import React, { PropTypes } from 'react';
import locales from '../../../i18n';
import validationLocales from '../../../utils/validatejs/i18n';
import Table from '../../Table.react';
import { Contact } from '../../../api';
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

    this.state = { contacts: [], contact: null, loading: true, loadErrors: false };

    this.contactApi = new Contact();
    this.userAbilities = new UserAbilities(context.userData.roles);
    this.actionModal = null;
    this.viewModal = null;
    this.deleteModal = null;
    this.createUserModal = null;
    this.contactForm = null;
  }

  componentWillMount() {
    this.context.i18n.register('BusinessPartnerValidatejs', validationLocales);
    this.context.i18n.register('BusinessPartner', locales);
  }

  componentDidMount() {
    return this.contactApi.all(this.props.businessPartnerId).then(contacts => {
      this.setState({ contacts: contacts, loading: false });
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

  addOnClick(event) {
    event.preventDefault();

    const title = this.context.i18n.getMessage('BusinessPartner.Contact.add');
    this.handleShowActionModal('add', null, title);
  }

  editOnClick(event, contact) {
    event.preventDefault();

    const title = this.context.i18n.getMessage('BusinessPartner.Contact.edit');
    this.handleShowActionModal('edit', contact, title);
  }

  async viewOnClick(event, contact) {
    event.preventDefault();

    await this.setState({ contact: contact });

    const title = this.context.i18n.getMessage('BusinessPartner.Contact.view');
    const buttons = { 'close': this.context.i18n.getMessage('BusinessPartner.Button.close') };
    const onButtonClick = () => this.viewModal.hide();

    this.viewModal.show(title, undefined, onButtonClick, buttons);
  }

  deleteOnClick(event, contact) {
    event.preventDefault();

    const title = this.context.i18n.getMessage('BusinessPartner.Contact.delete');
    let message = this.context.i18n.getMessage('BusinessPartner.Contact.Confirmation.delete');
    if (contact.isLinkedToUser)
      message += ` ${this.context.i18n.getMessage('BusinessPartner.Contact.Confirmation.linkedToUser')}`;

    const buttons = {
      'yes': this.context.i18n.getMessage('BusinessPartner.Button.yes'),
      'no': this.context.i18n.getMessage('BusinessPartner.Button.no')
    };

    const onButtonClick = (button) => {
      if (button === 'no') {
        this.deleteModal.hide();
      } else {
        this.deleteContact(contact).then(() => this.deleteModal.hide());
      }
    };

    this.deleteModal.show(title, message, onButtonClick, buttons);
  }

  createUserOnClick(event, contact) {
    event.preventDefault();

    const title = this.context.i18n.getMessage('BusinessPartner.Contact.createUser');
    const message = this.context.i18n.getMessage('BusinessPartner.Contact.Confirmation.createUser');
    const buttons = {
      'yes': this.context.i18n.getMessage('BusinessPartner.Button.yes'),
      'no': this.context.i18n.getMessage('BusinessPartner.Button.no')
    };

    const onButtonClick = (button) => {
      if (button === 'no') {
        this.createUserModal.hide();
      } else {
        this.createUser(contact).then(() => this.createUserModal.hide());
      }
    };

    this.createUserModal.show(title, message, onButtonClick, buttons);
  }

  async handleShowActionModal(action, contact, title) {
    const { i18n } = this.context;

    await this.setState({ contact: contact });

    const buttons = {
      'save': i18n.getMessage('BusinessPartner.Button.save'),
      'close': i18n.getMessage('BusinessPartner.Button.close')
    };

    const onButtonClick = (button) => {
      if (button === 'close') {
        this.actionModal.hide();
      } else {
        const errors = this.contactForm.validate();

        console.log(errors)

        if (errors) return false;

        console.log('Entered here!')
        return this[`${action}Contact`](this.contactForm.state.contact).then(() => {
          this.actionModal.hide();
        });
      }
    };

    this.actionModal.show(title, undefined, onButtonClick, buttons);
  }

  addContact(changedContact) {
    return this.contactApi.create(this.props.businessPartnerId, changedContact).then(contact => {
      let contacts = this.state.contacts;
      contacts.push(contact);

      this.setState({ contacts: contacts, contact: null });

      this.notify(this.context.i18n.getMessage('BusinessPartner.Contact.Message.saved'), 'info');
    }).catch(errors => {
      if (errors.status === 401) return this.props.onUnauthorized();

      console.log(`Error during create BusinessParterContact: ${errors.message}`);
      this.notify(this.context.i18n.getMessage('BusinessPartner.Contact.Message.saveFailed'), 'error');
    });
  }

  editContact(changedContact) {
    return this.contactApi.update(this.props.businessPartnerId, changedContact.id, changedContact).then(contact => {
      this.updateContacts(changedContact, contact);

      this.notify(this.context.i18n.getMessage('BusinessPartner.Contact.Message.updated'), 'info');
    }).catch(errors => {
      if (errors.status === 401) return this.props.onUnauthorized();

      this.notify(this.context.i18n.getMessage('BusinessPartner.Contact.Message.updateFailed'), 'error');
    });
  }

  deleteContact(contact) {
    return this.contactApi.delete(this.props.businessPartnerId, contact.id).then(() => {
      let contacts = this.state.contacts;
      const index = contacts.findIndex(con => con.id === contact.id);

      if (index === -1) {
        throw new Error(`Not found BusinessPartnerContact by id [${contact.id}]`);
      }
      contacts.splice(index, 1);

      this.setState({ contacts: contacts, contact: null });

      this.notify(this.context.i18n.getMessage('BusinessPartner.Contact.Message.deleted'), 'info');
    }).catch(errors => {
      if (errors.status === 401) return this.props.onUnauthorized();

      this.notify(this.context.i18n.getMessage('BusinessPartner.Contact.Message.deleteFailed'), 'error');
    });
  }

  createUser(contact) {
    return this.contactApi.createUser(contact.businessPartnerId, contact).then(resContact => {
      this.updateContacts(contact, resContact);

      this.notify(this.context.i18n.getMessage('BusinessPartner.Contact.Message.userCreated'), 'info');
    }).catch(error => {
      if (error.status == '409') {
        this.notify(this.context.i18n.getMessage('BusinessPartner.Contact.Error.userExists'), 'error');
      } else {
        this.notify(this.context.i18n.getMessage('BusinessPartner.Contact.Message.userCreateFailed'), 'error');
      }
    });
  }

  updateContacts(oldContact, newContact) {
    let contacts = this.state.contacts;
    const index = contacts.findIndex(cont => cont.id === oldContact.id);

    if (index === -1) throw new Error(`Not found contact by id=${oldContact.id}`);
    contacts[index] = newContact;

    this.setState({ contacts: contacts, contact: null });
  }

  notify(message, type) {
    if(this.context.showNotification) this.context.showNotification(message, type);
  }

  renderActions(contact) {
    return (
      <div className='text-right'>
        {this.userAbilities.actionGroupForContacts().map(action => {
          return  <ActionButton
                    key={action}
                    action={action}
                    onClick={event => this[`${action}OnClick`](event, contact)}
                    label={this.context.i18n.getMessage(`BusinessPartner.Button.${action}`)}
                    isSmall={true}
                    showIcon={true}
                  />
        })}
      </div>
    );
  }

  renderAddButton() {
    return (
      <button
        className='btn btn-primary pull-right'
        onClick={event => this.addOnClick(event)}
      >
        {this.context.i18n.getMessage('BusinessPartner.Button.add')}
      </button>
    );
  }

  renderTable() {
    const columns = [
      {
        Header: this.context.i18n.getMessage('BusinessPartner.Contact.Label.type'),
        accessor: 'type',
        Cell: row => {
          return row.value ? this.context.i18n.getMessage(`BusinessPartner.Contact.Type.${row.value}`) : '-';
        },
        maxWidth: 100
      },
      {
        Header: this.context.i18n.getMessage('BusinessPartner.Contact.Label.department'),
        accessor: 'department',
        Cell: row => {
          return row.value ? this.context.i18n.getMessage(`BusinessPartner.Contact.Department.${row.value}`) : '-';
        },
        maxWidth: 100
      },
      {
        Header: this.context.i18n.getMessage('BusinessPartner.Contact.Label.firstName'),
        accessor: 'firstName',
        style: { 'white-space': 'unset' }
      },
      {
        Header: this.context.i18n.getMessage('BusinessPartner.Contact.Label.lastName'),
        accessor: 'lastName',
        style: { 'white-space': 'unset' }
      },
      {
        Header: this.context.i18n.getMessage('BusinessPartner.Contact.Label.email'),
        accessor: 'email',
        minWidth: 150
      },
      {
        Header: '',
        accessor: element => element,
        id: 'actions',
        Cell: row => this.renderActions(row.value),
        style: { 'white-space': 'unset' },
        minWidth: 180
      }];

    return <Table data={this.state.contacts} columns={columns} loading={this.state.loading} defaultPageSize={5} />;
  }

  render() {
    if (this.state.loadErrors) return <ErrorView />;

    return (
      <div>
        {this.renderAddButton()}
        <h4 className='tab-description'>{this.context.i18n.getMessage('BusinessPartner.Heading.contact')}</h4>
        {this.renderTable()}
        <Components.ModalDialog ref={node => this.actionModal = node} >
          <Form ref={ node => this.contactForm = node } contact={ this.state.contact || {} } />
        </Components.ModalDialog>
        <Components.ModalDialog ref={node => this.viewModal = node} >
          <View contact={ this.state.contact || {} } />
        </Components.ModalDialog>
        <Components.ModalDialog ref={node => this.deleteModal = node} />
        <Components.ModalDialog ref={node => this.createUserModal = node} />
      </div>
    );
  }
};
