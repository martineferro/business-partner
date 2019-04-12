import React, { Component, PropTypes } from 'react';
import ViewRow from '../../AttributeValueEditorRow.react.js';
import CountryView from '../../CountryView.react';

export default class View extends Component {
  static propTypes = {
    address: PropTypes.object.isRequired
  };

  static contextTypes = {
    i18n : React.PropTypes.object.isRequired
  };

  translatedFieldValue = (name, value) => {
    return value ? this.context.i18n.getMessage(`BusinessPartner.Address.${name}.${value}`) : '-';
  };

  renderField = (attrs) => {
    const { supplierAddress } = this.props;
    const fieldName = attrs.fieldName;
    const labelText = this.context.i18n.getMessage(`BusinessPartner.Address.Label.${fieldName}`);
    const component = attrs.component || supplierAddress[fieldName] || '-'
    return (
      <ViewRow labelText={ labelText }>
        <p style={ { marginTop: '7px' } }>{ component }</p>
      </ViewRow>
    );
  };

  render() {
    const address = this.props.supplierAddress;

    return (
      <div className="form-horizontal">
        { this.renderField({
          fieldName: 'type',
          component:  this.translatedFieldValue('Type', address.type) }) }
        { this.renderField({ fieldName: 'name' }) }
        { this.renderField({ fieldName: 'street1' }) }
        { this.renderField({ fieldName: 'street2' }) }
        { this.renderField({ fieldName: 'street3' }) }
        { this.renderField({ fieldName: 'zipCode' }) }
        { this.renderField({ fieldName: 'city' }) }
        { this.renderField({
          fieldName: 'countryId',
          component: <CountryView countryId={address.countryId} /> }) }
        { this.renderField({ fieldName: 'areaCode' }) }
        { this.renderField({ fieldName: 'state' }) }
        { this.renderField({ fieldName: 'pobox' }) }
        { this.renderField({ fieldName: 'poboxZipCode' }) }
        { this.renderField({ fieldName: 'phoneNo' }) }
        { this.renderField({ fieldName: 'faxNo' }) }
        { this.renderField({ fieldName: 'email' }) }
      </div>
    );
  }
};
