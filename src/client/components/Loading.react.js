import React, { Component } from 'react';

export default class Loading extends Component {
  static contextTypes = {
    i18n: React.PropTypes.object.isRequired
  };

  render() {
    return <div>{ this.context.i18n.getMessage('BusinessPartner.Messages.loading') }</div>;
  }
}
