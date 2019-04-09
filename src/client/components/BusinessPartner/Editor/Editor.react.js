import React, { PropTypes } from 'react';
import validationMessages from '../../../utils/validatejs/i18n';
import i18nMessages from '../../../i18n';
import { Components } from '@opuscapita/service-base-ui';
import Form from '../Form.react.js';
import View from './View.react.js';
import { BusinessPartner } from '../../../api';
import UserAbilities from '../../../UserAbilities';
import Loading from '../../Loading.react';
import ErrorView from '../../ErrorView.react';
import FormAction from '../FormAction';

/**
 * Provide general company information.
 */
class Editor extends Components.ContextComponent {

  static propTypes = {
    businessPartnerId: PropTypes.string.isRequired,
    onChange: React.PropTypes.func,
    onUpdate: React.PropTypes.func,
    onUnauthorized: React.PropTypes.func,
    onLogout: React.PropTypes.func
  };

  constructor(props, context) {
    super(props);

    this.state = {
      isLoaded: false,
      hasErrors: false,
      businessPartner: {}
    };

    this.api = new BusinessPartner();
    this.userAbilities = new UserAbilities(context.userData.roles);
  }

  componentWillMount() {
    this.context.i18n.register('BusinessPartnerValidatejs', validationMessages);
    this.context.i18n.register('BusinessPartner', i18nMessages);
  }

  componentDidMount() {
    if (this.state.isLoaded) return;

    return this.api.find(this.props.businessPartnerId).then(businessPartner => {
      this.setState({ isLoaded: true, businessPartner: businessPartner });
    }).catch(errors => {
      if (errors.status === 401) {
        this.props.onUnauthorized();
        return;
      }

      this.setState({ isLoaded: true, hasErrors: true });
    });
  }

  componentWillReceiveProps(nextProps, nextContext) {

    if(nextContext.i18n){
      nextContext.i18n.register('BusinessPartnerValidatejs', validationMessages);
      nextContext.i18n.register('BusinessPartner', i18nMessages);
    }
  }

  handleChange = () => {
    if (this.props.onChange) {
      this.props.onChange({ isDirty: true });
    }
  }

  handleUpdate = editedBPartner => {
    if (!editedBPartner) {
      return this.setState({ globalInfoMessage: '', globalErrorMessage: '' });
    }

    return this.api.update(this.props.businessPartnerId, editedBPartner).then(businessPartner => {
      this.setState({ businessPartner: businessPartner });

      if(this.context.showNotification)
        this.context.showNotification(this.context.i18n.getMessage('BusinessPartner.Messages.updateSaved'), 'info')

      if (this.props.onUpdate && this.props.businessPartnerId !== businessPartner.id) {
        this.props.onUpdate({ id: businessPartner.id, name: businessPartner.name });
      }

      if (this.props.onChange)  this.props.onChange({ isDirty: false });
    }).
    catch(errors => {
      switch (errors.status) {
        case 401:
          this.props.onUnauthorized();
          break;
        case 409:
          if(this.context.showNotification)
            this.context.showNotification(this.context.i18n.getMessage('BusinessPartner.Messages.failedCreatingExistingBusinessPartner'), 'error')
          break;
        default:
          if(this.context.showNotification)
            this.context.showNotification(this.context.i18n.getMessage('BusinessPartner.Messages.updateFailed'), 'error')
      }
    });
  }

  renderView() {
    return (
      <div className="col-sm-6">
        <h4 className="tab-description">
          { this.context.i18n.getMessage(`BusinessPartner.Heading.companyInformation`) }
        </h4>
        <View businessPartner={ this.state.businessPartner } />
      </div>
    );
  }

  render() {
    const { isLoaded, hasErrors, globalInfoMessage = '', globalErrorMessage = '' } = this.state;
    const { i18n } = this.context;

    if (!isLoaded) return <Loading />;

    if (hasErrors) return <ErrorView />;

    if (!this.userAbilities.canEditBusinessPartner()) return <div className="row">{this.renderView()}</div>;

    return (
      <div>
        <h4 className="tab-description">
          { i18n.getMessage(`BusinessPartner.Heading.companyInformation`) }
        </h4>
        <Form
          action={FormAction.UPDATE}
          businessPartner={ this.state.businessPartner }
          onAction={ this.handleUpdate }
          onChange={ this.handleChange }
          onCancel={ this.props.onLogout }
        />
      </div>
    );
  }
}

export default Editor;
