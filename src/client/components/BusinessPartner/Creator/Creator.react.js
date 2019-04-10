import React, { PropTypes } from 'react';
import validationMessages from '../../../utils/validatejs/i18n';
import i18nMessages from '../../../i18n';
import { Components } from '@opuscapita/service-base-ui';
import Form from '../Form.react.js';
import { BusinessPartner } from '../../../api';
import UserAbilities from '../../../models/UserAbilities';
import ErrorView from '../../ErrorView.react';
import FormAction from '../FormAction';

class Creator extends Components.ContextComponent {

  static propTypes = {
    onChange: React.PropTypes.func,
    onCreate: React.PropTypes.func,
    onUnauthorized: React.PropTypes.func,
    onLogout: React.PropTypes.func
  };

  constructor(props, context) {
    super(props, context);

    this.state = {
      hasErrors: false,
      businessPartner: { managed: true, isSupplier: false, isCustomer: false }
    };
    this.api = new BusinessPartner();
    this.userAbilities = new UserAbilities(context.userData.roles);
  }

  componentWillMount(){
    this.context.i18n.register('BusinessPartnerValidatejs', validationMessages);
    this.context.i18n.register('BusinessPartner', i18nMessages);
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if(nextContext.i18n){
      nextContext.i18n.register('BusinessPartnerValidatejs', validationMessages);
      nextContext.i18n.register('BusinessPartner', i18nMessages);
    }
  }

  handleChange = () => {
    if (this.props.onChange) this.props.onChange({ isDirty: true });
  }

  handleCreate = newBusinessPartner => {
    if (!newBusinessPartner) return;

    return this.api.create(newBusinessPartner).then(createdBusinessParnter => {
      this.setState({ businessPartner: createdBusinessParnter });

      if(this.context.showNotification)
        this.context.showNotification(this.context.i18n.getMessage('BusinessPartner.Messages.createSuccess'), 'info')

      if (this.props.onCreate) this.props.onCreate(createdBusinessParnter.id);
    }).
    catch(errors => {
      switch (errors.status) {
        case 401:
          this.props.onUnauthorized();
          break;
        default:
          if(this.context.showNotification)
            this.context.showNotification(this.context.i18n.getMessage('BusinessPartner.Messages.createFailed'), 'error');
      }

      return Promise.resolve(null);
    });
  }

  render() {
    const { hasErrors } = this.state;

    if (hasErrors) return <ErrorView />;

    if (!this.userAbilities.canCreateBusinessPartner())
      return <div className="alert alert-danger">{this.context.i18n.getMessage('BusinessPartner.Error.notAuthorized')}</div>;

    return (
      <div className="row">
        <h4 className="tab-description">
          { this.context.i18n.getMessage(`BusinessPartner.Heading.createBusinessPartner`) }
        </h4>
        <Form
          action={FormAction.CREATE}
          businessPartner={ this.state.businessPartner }
          onAction={ this.handleCreate }
          onChange={ this.handleChange }
          onCancel={ this.props.onLogout }
        />
      </div>
    );
  }
}

export default Creator;
