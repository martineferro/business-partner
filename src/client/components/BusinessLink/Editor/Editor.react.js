import { BusinessLink } from '../../../api';
import React, { PropTypes } from 'react';
import { Components } from '@opuscapita/service-base-ui';
import Form from './Form.react.js';
import locales from '../../../i18n';
import validationLocales from '../../../utils/validatejs/i18n';
import Loading from '../../Loading.react';

export default class Editor extends Components.ContextComponent {
  static propTypes = {
    businessLinkId: PropTypes.string,
    onCreateOrUpdate: PropTypes.func
  };

  constructor(props) {
    super(props);

    this.state = { businessLink: {}, mode: 'create', loading: true };

    this.api = new BusinessLink();
  }

  componentWillMount() {
    this.context.i18n.register('BusinessPartnerValidatejs', validationLocales);
    this.context.i18n.register('BusinessLink', locales);
  }

  async componentDidMount() {
    if (!this.props.businessLinkId) {
      this.setState({ loading: false });
      return;
    }

    this.loadBusinessLink(this.props.businessLinkId);
  }

  async loadBusinessLink(businessLinkId) {
    try {
      const businessLinks = await this.api.all({ id: businessLinkId, include: 'supplier,customer' });

      if (!businessLinks[0]) return;

      this.setState({ businessLink: businessLinks[0], mode: 'update', loading: false });
    } catch(error) {
      this.setState({ loading: false });
      console.log(error);
      this.notify(this.context.i18n.getMessage('BusinessLink.Message.Error.general'), 'error');
    }
  }

  componentWillReceiveProps(nextProps, nextContext){
    if(nextContext.i18n) {
      nextContext.i18n.register('BusinessPartnerValidatejs', validationLocales);
      nextContext.i18n.register('BusinessLink', locales);
    }
  }

  notify(message, type) {
    if (this.context.showNotification) this.context.showNotification(message, type);
  }

  handleUpdate = async newBusinessLink => {
    try {
      let changedBusinessLink;

      if (newBusinessLink.id) {
        changedBusinessLink = await this.api.update(newBusinessLink);
      } else {
        changedBusinessLink = await this.api.create(newBusinessLink);
      }

      this.notify(this.context.i18n.getMessage(`BusinessLink.Message.Success.${this.state.mode}d`), 'info');

      await this.loadBusinessLink(changedBusinessLink.id);

      if (this.props.onCreateOrUpdate) this.props.onCreateOrUpdate({ id: changedBusinessLink.id });
    } catch(error) {
      this.notify(this.context.i18n.getMessage(`BusinessLink.Message.Error.${this.state.mode}`), 'error');
    }
  };

  render() {
    if (this.state.loading) return <Loading />;

    return (
      <div>
        <h4>{this.context.i18n.getMessage(`BusinessLink.Message.Heading.${this.state.mode}`)}</h4>
        <br />
        <div className="row">
          <div className="col-sm-6">
            <Form
              businessLink={ this.state.businessLink }
              mode={ this.state.mode }
              onBusinessLinkUpate={ this.handleUpdate }
              onCancel={ this.props.onLogout }
            />
          </div>
        </div>
      </div>
    );
  }
};
