import React, { Component, PropTypes } from 'react';
import ViewRow from '../../AttributeValueEditorRow.react.js';
import CountryView from '../../CountryView.react';
import dateHelper from '../../../utils/dateHelper';

export default class View extends Component {
  static propTypes = {
    businessPartner: PropTypes.object.isRequired
  };

  static contextTypes = {
    i18n : React.PropTypes.object.isRequired
  };

  renderField = (attrs) => {
    const { businessPartner } = this.props;
    const fieldName = attrs.fieldName;
    let value = businessPartner[fieldName];

    if (fieldName == 'foundedOn') value = dateHelper.format(value, this.context.i18n.locale);

    return (
      <ViewRow labelText={ this.context.i18n.getMessage(`Supplier.Label.${fieldName}`) }>
        <p style={ { marginTop: '7px' } }>{ attrs.component || value || '-' }</p>
      </ViewRow>
    );
  };

  render() {
    return (
      <div className="form-horizontal">
        { this.renderField({ fieldName: 'name' }) }
        { this.renderField({ fieldName: 'homePage' }) }
        { this.renderField({ fieldName: 'foundedOn' }) }
        { this.renderField({ fieldName: 'legalForm' }) }
        { this.renderField({ fieldName: 'cityOfRegistration' })}
        { this.renderField({
          fieldName: 'countryOfRegistration',
          component: <CountryView countryId={this.props.businessPartner.countryOfRegistration} />
        }) }
        { this.renderField({ fieldName: 'commercialRegisterNo' }) }
        { this.renderField({ fieldName: 'taxIdentificationNo' }) }
        { this.renderField({ fieldName: 'vatIdentificationNo' }) }
        { this.renderField({ fieldName: 'globalLocationNo' }) }
        { this.renderField({ fieldName: 'dunsNo' }) }
      </div>
    );
  }
};
