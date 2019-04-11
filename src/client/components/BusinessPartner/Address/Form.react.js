import React, { PropTypes } from 'react';
import { Components } from '@opuscapita/service-base-ui';
import FormRow from '../../AttributeValueEditorRow.react.js';
import Constraints from './FormConstraints';
import validator from 'validate.js';
import Address from '../../../models/BusinessPartnerAddress';

class Form extends Components.ContextComponent {
  static propTypes = {
    address: PropTypes.object.isRequired,
    errors: React.PropTypes.object
  };

  static defaultProps = { errors: {} };

  constructor(props, context) {
    super(props, context);

    this.state = { address: this.props.address, errors: this.props.errors };

    this.CountryField = context.loadComponent({
      serviceName: 'isodata',
      moduleName: 'isodata-countries',
      jsFileName: 'countries-bundle'
    });
  }

  componentWillMount() {
    this.constraints = new Constraints(this.context.i18n);
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if (nextProps.address)
      this.setState({ address: nextProps.address, errors: nextProps.errors || {} });

    this.constraints = new Constraints(nextContext.i18n);
  }

  handleChange(fieldName, event) {
    const value = event && event.target ? event.target.value : event;

    this.setState({ address: { ...this.state.address, [fieldName]: value } });
  }

  handleBlur(fieldName) {
    this.validateFields(this.state.address, this.constraints.forField(fieldName), true);
  }

  validate() {
    return this.validateFields(this.state.address, this.constraints.all);
  }

  setBlurErrors(errors, fieldName) {
    this.setState({
      errors: {
        ...this.state.errors,
        [fieldName]: errors ? errors[fieldName].map(msg => ({ message: msg })) : []
      }
    });
  }

  setActionErrors(errors) {
    if (!errors) return null;

    const errorsReformatted = Object.keys(errors).map(fieldName => ({
      [fieldName]: errors[fieldName].map(element =>({ message: element }))
    })).reduce((current, prev, {}) => Object.assign(current, prev));

    this.setState({ errors: errorsReformatted });

    return errors;
  }

  validateFields(address, constraints, blur = false) {
    const errors = validator(address, constraints, { fullMessages: false })

    if (blur) return this.setBlurErrors(errors, Object.keys(constraints)[0]);

    return this.setActionErrors(errors);
  }

  renderField(attrs) {
    const { address, errors } = this.state;
    const { fieldName } = attrs;
    const constraints = this.constraints.all;

    let component = attrs.component ||
      <input className="form-control"
        type="text"
        value={ typeof address[fieldName] === 'string' ? address[fieldName] : '' }
        onChange={this.handleChange.bind(this, fieldName)}
        onBlur={ this.handleBlur.bind(this, fieldName) }
      />;

    return (
      <FormRow
        labelText={ this.context.i18n.getMessage(`BusinessPartner.Address.Label.${fieldName}`) }
        required={ Boolean(constraints[fieldName] && constraints[fieldName].presence) }
        rowErrors={ errors[fieldName] || [] }
      >
        { component }
      </FormRow>
    );
  }

  render() {
    const { address } = this.state;

    let typeOptions = [];

    typeOptions.push({
      value: '',
      label: this.context.i18n.getMessage('BusinessPartner.Select.type'),
      disabled: true
    });

    for (const addressType of Address.TYPES) {
      typeOptions.push({
        value: addressType,
        label: this.context.i18n.getMessage(`BusinessPartner.Address.Type.${addressType}`),
        disabled: false
      });
    }

    return (
      <div className='form-horizontal'>
        { this.renderField({
            fieldName: 'type',
            component: (
              <select className="form-control"
                value={address.type || ''}
                onChange={this.handleChange.bind(this, 'type')}
                onBlur={this.handleBlur.bind(this, 'type')}
              >
                {typeOptions.map((item, idx) => {
                  return <option key={idx} disabled={item.disabled} value={item.value}>{item.label}</option>;
                })}
              </select>
            )
          }) }

        { this.renderField({ fieldName: 'name' }) }
        { this.renderField({ fieldName: 'street1' }) }
        { this.renderField({ fieldName: 'street2' }) }
        { this.renderField({ fieldName: 'street3' }) }
        { this.renderField({ fieldName: 'zipCode' }) }
        { this.renderField({ fieldName: 'city' }) }

        { this.renderField({
            fieldName: 'countryId',
            component: (
              <this.CountryField
                value={address.countryId}
                onChange={this.handleChange.bind(this, 'countryId')}
                onBlur={this.handleBlur.bind(this, 'countryId')}
                optional={true}
              />
            )
          })}

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

export default Form;
