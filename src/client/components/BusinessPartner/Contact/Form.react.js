import React, { PropTypes } from 'react';
import { Components } from '@opuscapita/service-base-ui';
import FormRow from '../../AttributeValueEditorRow.react.js';
import Constraints from './FieldConstraints';
import validator from 'validate.js';
import Contact from '../../../models/BusinessPartnerContact';
import stringHelper from '../../../utils/stringHelper';

class Form extends Components.ContextComponent {
  static propTypes = {
    contact: PropTypes.object.isRequired,
    errors: React.PropTypes.object
  };

  static defaultProps = { errors: {} };

  constructor(props, context) {
    super(props, context);

    this.state = { contact: this.props.contact, errors: this.props.errors };
  }

  componentWillMount() {
    this.constraints = new Constraints(this.context.i18n);
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if (nextProps.contact)
      this.setState({ contact: nextProps.contact, errors: nextProps.errors || {} });

    this.constraints = new Constraints(nextContext.i18n);
  }

  handleChange(fieldName, event) {
    this.setState({ contact: { ...this.state.contact, [fieldName]: event.target.value } });
  }

  handleBlur(fieldName) {
    this.validateFields(this.state.contact, this.constraints.forField(fieldName), true);
  }

  validate() {
    return this.validateFields(this.state.contact, this.constraints.all);
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

  validateFields(contact, constraints, blur = false) {
    const errors = validator(contact, constraints, { fullMessages: false })

    if (blur) return this.setBlurErrors(errors, Object.keys(constraints)[0]);

    return this.setActionErrors(errors);
  }

  selectOptions(fieldName, fieldOptions) {
    let options = [];
    const fieldNameCapitalized = stringHelper.capitalize(fieldName);
    const message = this.context.i18n.getMessage;

    options.push({ value: '', label: message(`BusinessPartner.Select.${fieldName}`), disabled: true });

    for (const option of fieldOptions) {
      options.push({
        value: option,
        label: message(`BusinessPartner.Contact.${fieldNameCapitalized}.${option}`),
        disabled: false
      })
    }

    return options;
  }

  renderField(attrs) {
    const { contact, errors } = this.state;
    const { fieldName } = attrs;
    const constraints = this.constraints.all;

    let component = attrs.component ||
      <input className="form-control"
        type="text"
        value={ typeof contact[fieldName] === 'string' ? contact[fieldName] : '' }
        onChange={this.handleChange.bind(this, fieldName)}
        onBlur={ this.handleBlur.bind(this, fieldName) }
      />;

    return (
      <FormRow
        labelText={ this.context.i18n.getMessage(`BusinessPartner.Contact.Label.${fieldName}`) }
        required={ Boolean(constraints[fieldName] && constraints[fieldName].presence) }
        rowErrors={ errors[fieldName] || [] }
      >
        { component }
      </FormRow>
    );
  }

  render() {
    const { contact } = this.state;

    return (
      <div className="form-horizontal">
        { this.renderField({
            fieldName: 'type',
            component: (
              <select className="form-control"
                value={contact.type || ''}
                onChange={this.handleChange.bind(this, 'type')}
                onBlur={this.handleBlur.bind(this, 'type')}
              >
                {this.selectOptions('type', Contact.TYPES).map((item, index) => {
                  return (<option key={index} disabled={item.disabled} value={item.value}>{item.label}</option>);
                })}
              </select>
            )
          }) }
        { this.renderField({
            fieldName: 'department',
            component: (
              <select className="form-control"
                value={contact.department || ''}
                onChange={this.handleChange.bind(this, 'department')}
                onBlur={this.handleBlur.bind(this, 'department')}
              >
                {this.selectOptions('department', Contact.DEPARTMENTS).map((item, index) => {
                  return (<option key={index} disabled={item.disabled} value={item.value}>{item.label}</option>);
                })}
              </select>
            )
          }) }
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

export default Form;
