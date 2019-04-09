import React, { PropTypes } from 'react';
import validationMessages from '../../../utils/validatejs/i18n';
import i18nMessages from '../../../i18n';
import RegistratorForm from '../Form.react';
import AccessRequestForm from './AccessRequestForm.react';
import AccessView from './AccessView.react';
import { BusinessPartner, Access, Auth, Contact } from '../../../api';
import { Components } from '@opuscapita/service-base-ui';
import Loading from '../../Loading.react';
import ErrorView from '../../ErrorView.react';
import FormAction from '../FormAction';

/**
 * Provide general company information.
 */
class Registrator extends Components.ContextComponent {

  static propTypes = {
    businessPartner: PropTypes.object,
    onChange: React.PropTypes.func,
    onUpdate: React.PropTypes.func,
    onUnauthorized: React.PropTypes.func,
    onLogout: React.PropTypes.func
  };

  constructor(props) {
    super(props);

    this.state = {
      hasErrors: false,
      businessPartner: this.props.businessPartner,
      businessPartnerAccess: null,
      accessAttributes: null,
      businessPartnerExist: false,
      loading: true
    }

    this.api = new BusinessPartner();
    this.authApi = new Auth();
    this.contactApi = new Contact();
    this.accessApi = new Access();
  }

  componentWillMount(){
    this.context.i18n.register('BusinessPartnerValidatejs', validationMessages);
    this.context.i18n.register('BusinessPartner', i18nMessages);
  }

  componentDidMount() {
    return this.accessApi.get(this.context.userData.id).then(businessPartnerAccess => {
      const businessPartnerId = businessPartnerAccess.businessPartnerId;

      this.setState({
        loading: false,
        businessPartnerAccess: businessPartnerAccess,
        businessPartnerExist: Boolean(businessPartnerId)
      });

      if (businessPartnerId) {
        this.api.find(businessPartnerId).then(businessPartner => {
          this.setState({ businessPartner: businessPartner });
        }).catch(error => null);
      }
    }).catch(error => {
      return this.setState({ loading: false, businessPartnerExist: false });
    });
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if(nextContext.i18n){
      nextContext.i18n.register('BusinessPartnerValidatejs', validationMessages);
      nextContext.i18n.register('BusinessPartner', i18nMessages);
    }
  }

  postBusinessPartnerCreate = () => {
    return this.authApi.refreshIdToken().then(() => {
      console.log('id token refreshed');

      const businessPartner = this.state.businessPartner;
      const user = this.context.userData;
      const contact = {
        contactType: 'default',
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        businessPartnerId: businessPartner.id,
        createdBy: user.id,
        changedBy: user.id,
        isLinkedToUser: true
      }

      return this.contactApi.create(businessPartner.id, contact).then(() => {
        console.log('contact created');

        if (this.props.onUpdate) {
          this.props.onUpdate({ id: businessPartner.id, name: businessPartner.name });
        }

        if (this.props.onChange) this.props.onChange({ isDirty: false });

        return Promise.resolve(null);
      }).catch(err => {
        console.error('error creating contact: ' + err);
        throw err;
      })
    }).catch(err => {
      console.err('error refreshing idToken: ' + err);
      throw err;
    });
  }

  handleChange = () => {
    if (this.props.onChange) {
      this.props.onChange({ isDirty: true });
    }
  }

  handleRegister = newBusinessPartner => {
    if (!newBusinessPartner) return;

    return this.api.create(newBusinessPartner).then(createdBusinessPartner => {
      this.setState({ businessPartner: createdBusinessPartner });

      if(this.context.showNotification)
        this.context.showNotification(this.context.i18n.getMessage('BusinessPartner.Messages.createSuccess'), 'info')

      return this.postBusinessPartnerCreate();
    }).
    catch(errors => {
      this.setState({ businessPartner: newBusinessPartner });

      switch (errors.status) {
        case 403: case 405:
          if(this.context.showNotification)
            this.context.showNotification(this.context.i18n.getMessage('BusinessPartner.Messages.failedCreatingUserSupplier'), 'error');
          break;
        case 401:
          this.props.onUnauthorized();
          break;
        case 409:
          this.setState({ businessPartnerExist: true });
          break;
        default:
          if(this.context.showNotification)
            this.context.showNotification(this.context.i18n.getMessage('BusinessPartner.Messages.createFailed'), 'error');
      }

      return Promise.resolve(null);
    });
  }

  handleAccess = () => {
    const body = { businessPartnerId: this.state.businessPartner.id, userId: this.context.userData.id };

    this.accessApi.grant(body).then(() => this.postBusinessPartnerCreate()).catch(errors => {
      if(this.context.showNotification)
        this.context.showNotification(this.context.i18n.getMessage('BusinessPartner.Messages.createFailed'), 'error');
    });
  }

  handleAccessRequest = (attributes) => {
    this.setState({ accessAttributes: attributes });
  }

  handleCancelAccessRequest = () => {
    this.setState({ accessAttributes: null });
  }

  handleSaveAccessRequest = (accessAttributes, businessPartner) => {
    accessAttributes.userId = this.context.userData.id;
    accessAttributes.createdBy = this.context.userData.id;
    this.accessApi.create(accessAttributes).then(businessPartnerAccess => {
      this.setState({
        businessPartnerAccess: businessPartnerAccess,
        businessPartnerExist: true,
        businessPartner: businessPartner
      });
    });
  }

  toRender = () => {
    if (this.state.businessPartnerExist) return <AccessView
                                          businessPartnerAccess={ this.state.businessPartnerAccess }
                                          businessPartner={ this.state.businessPartner }
                                          onAccessConfirm= { this.handleAccess }
                                         />

    if (this.state.accessAttributes) {
      return <AccessRequestForm
              accessAttributes={ this.state.accessAttributes }
              userId={ this.context.userData.id }
              onCreateAccess={ this.handleSaveAccessRequest }
              onCancel={ this.handleCancelAccessRequest }
             />
    }

    return <RegistratorForm
              action={FormAction.REGISTER}
              businessPartner={ this.state.businessPartner }
              onAction={ this.handleRegister }
              onChange={ this.handleChange }
              onCancel={ this.props.onLogout }
              onAccessRequest={ this.handleAccessRequest }
           />
  }

  render() {
    const { loading, hasErrors } = this.state;

    if (loading) return <Loading />;

    if (hasErrors) return <ErrorView />;

    return (
      <div className="business-partner-registration-container">
        <div id='business-partner-registration'>
          <h2>{this.context.i18n.getMessage('BusinessPartner.Heading.companyRegistration')}</h2>
          {this.toRender()}
        </div>
      </div>
    );
  }
}

export default Registrator;
