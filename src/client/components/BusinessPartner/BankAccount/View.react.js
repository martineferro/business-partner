import React, { Component, PropTypes } from 'react';
import ViewRow from '../../AttributeValueEditorRow.react.js';
import CountryView from '../../CountryView.react';

export default class View extends Component {
  static propTypes = {
    bankAccount: PropTypes.object.isRequired
  };

  static contextTypes = {
    i18n : React.PropTypes.object.isRequired
  };

  renderField(attrs) {
    const { bankAccount } = this.props;
    const fieldName = attrs.fieldName;
    const labelText = this.context.i18n.getMessage(`BusinessPartner.BankAccount.Label.${fieldName}`);
    const component = attrs.component || bankAccount[fieldName] || '-'
    return (
      <ViewRow labelText={ labelText }>
        <p style={ { marginTop: '7px' } }>{ component }</p>
      </ViewRow>
    );
  }

  render() {
    return (
      <div className="form-horizontal">
        { this.renderField({ fieldName: 'bankName' }) }
        { this.renderField({ fieldName: 'accountNumber' }) }
        { this.renderField({ fieldName: 'bankIdentificationCode' }) }
        { this.renderField({ fieldName: 'bankCode' }) }
        { this.renderField({
          fieldName: 'bankCountryKey',
          component: <CountryView countryId={this.props.bankAccount.bankCountryKey} /> }) }
        { this.renderField({ fieldName: 'extBankControlKey' })}
        { this.renderField({ fieldName: 'bankgiro' })}
        { this.renderField({ fieldName: 'plusgiro' })}
        { this.renderField({ fieldName: 'isrNumber' })}
      </div>
    );
  }
};
