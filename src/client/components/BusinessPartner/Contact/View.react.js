import React, { Component, PropTypes } from 'react';
import ViewRow from '../../AttributeValueEditorRow.react.js';
import CountryView from '../../CountryView.react';

export default class View extends Component {
  static propTypes = {
    contact: PropTypes.object.isRequired
  };

  static contextTypes = {
    i18n : React.PropTypes.object.isRequired
  };

  translatedFieldValue = (name, value) => {
    return value ? this.context.i18n.getMessage(`BusinessPartner.Contact.${name}.${value}`) : '-';
  };

  renderField(attrs) {
    const { contact } = this.props;
    const fieldName = attrs.fieldName;
    const labelText = this.context.i18n.getMessage(`BusinessPartner.Contact.Label.${fieldName}`);
    const component = attrs.component || contact[fieldName] || '-'
    return (
      <ViewRow labelText={ labelText }>
        <p style={ { marginTop: '7px' } }>{ component }</p>
      </ViewRow>
    );
  }

  render() {
    const contact = this.props.contact;

    return (
      <div className="form-horizontal">
        { this.renderField({
          fieldName: 'type',
          component:  this.translatedFieldValue('Type', contact.type) }) }
        { this.renderField({
          fieldName: 'department',
          component:  this.translatedFieldValue('Department', contact.department) }) }
        { this.renderField({ fieldName: 'title' }) }
        { this.renderField({ fieldName: 'firstName' }) }
        { this.renderField({ fieldName: 'lastName' }) }
        { this.renderField({ fieldName: 'email' }) }
        { this.renderField({ fieldName: 'phone' }) }
        { this.renderField({ fieldName: 'mobile' }) }
        { this.renderField({ fieldName: 'fax' }) }
      </div>
    );
  }
};
