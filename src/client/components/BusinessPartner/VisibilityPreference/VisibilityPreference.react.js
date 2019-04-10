import React, { PropTypes } from 'react';
import i18nMessages from '../../../i18n';
import VisibilityForm from './VisibilityForm.react.js';
import { Components } from '@opuscapita/service-base-ui';
import { Visibility } from '../../../api';
import Public from '../Public';
import Loading from '../../Loading.react';

class VisibilityPreference extends Components.ContextComponent {
  static propTypes = {
    businessPartnerId: PropTypes.string.isRequired
  };

  constructor(props) {
    super(props);

    this.state = { isLoaded: false, hasErrors: false, visibility: {} };

    this.visApi = new Visibility();
    this.publicModal = null;
  }

  componentWillMount() {
    this.context.i18n.register('BusinessPartner', i18nMessages);
  }

  componentDidMount() {
    if (this.state.isLoaded) return;

    this.visApi.find(this.props.businessPartnerId).then(visibility => {
      this.setState({ isLoaded: true, visibility: visibility });
    }).catch(errors => this.setState({ isLoaded: true }));
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if (nextContext.i18n) nextContext.i18n.register('BusinessPartner', i18nMessages);
  }

  handleUpdate = newVisibility => {
    if(!newVisibility) return;

    newVisibility.businessPartnerId = this.props.businessPartnerId;
    return this.visApi.createOrUpdate(this.props.businessPartnerId, newVisibility).then(vis => {
      this.setState({ visibility: vis });

      if(this.context.showNotification)
        this.context.showNotification(this.context.i18n.getMessage('BusinessPartner.Visibility.Message.updateSaved'), 'info')
    });
  }

  handleShowPublicProfile(businessPartnerId) {
    const title = this.context.i18n.getMessage('BusinessPartner.Heading.companyInformation');
    const buttons = { 'close': this.context.i18n.getMessage('BusinessPartner.Button.close') };
    const onButtonClick = () => this.publicModal.hide();
    this.publicModal.show(title, undefined, onButtonClick, buttons);
  }

  render() {
    const { isLoaded } = this.state;
    const { businessPartnerId } = this.props;

    if (!isLoaded) return <Loading />;

    return (
      <div>
        <button className='btn btn-default pull-right' onClick={this.handleShowPublicProfile.bind(this, businessPartnerId)} >
          {this.context.i18n.getMessage('BusinessPartner.Button.publicProfile')}
        </button>
        <h4 className="tab-description">
          { this.context.i18n.getMessage(`BusinessPartner.Heading.visibility`) }
        </h4>
        <div className="row">
          <div className="col-sm-6">
            <VisibilityForm
              visibility={ this.state.visibility }
              onUpdate={ this.handleUpdate }
            />
          </div>
        </div>
        <Components.ModalDialog ref={node => this.publicModal = node} size='large' >
          <Public businessPartnerId={businessPartnerId} public={true}/>
        </Components.ModalDialog>
      </div>
    );
  }

};

export default VisibilityPreference;
