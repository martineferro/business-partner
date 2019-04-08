import React, { PropTypes, Component } from 'react';

class AccessView extends Component {
  static propTypes = {
    businessPartnerAccess: PropTypes.object.isRequired,
    businessPartner: PropTypes.object.isRequired,
    onAccessConfirm: PropTypes.func.isRequired
  };

  static contextTypes = {
    i18n : React.PropTypes.object.isRequired
  };

  handleOnClick(event) {
    event.preventDefault && event.preventDefault();
    this.props.onAccessConfirm();
  }

  renderAccessInformation() {
    if (this.props.businessPartnerAccess.status !== 'requested') return null;

    return <p>{this.context.i18n.getMessage('BusinessPartner.Messages.accessInformation4')}</p>
  }

  renderAccessLink() {
    if (this.props.businessPartnerAccess.status !== 'approved') return null;

    return (
      <p>
        <button className="btn btn-default" onClick={this.handleOnClick.bind(this)}>
          {this.context.i18n.getMessage('BusinessPartner.Button.access')}
        </button>
      </p>
    );
  }

  render() {
    const { i18n } = this.context;
    const status = i18n.getMessage(`BusinessPartner.AccessRequest.Status.${this.props.businessPartnerAccess.status}`);
    return (
      <div className="alert alert-info">
        <h5>{i18n.getMessage('BusinessPartner.AccessRequest.head', { name: this.props.businessPartner.name })}</h5>
        {this.renderAccessInformation()}
        <p><strong>{i18n.getMessage('BusinessPartner.AccessRequest.Status.text')}: {status}</strong></p>
        {this.renderAccessLink()}
        <p>{i18n.getMessage('BusinessPartner.AccessRequest.text')}</p>
      </div>
    );
  }
}

export default AccessView;
