import React, { PropTypes } from 'react';
import { Components } from '@opuscapita/service-base-ui';
import FormRow from '../../AttributeValueEditorRow.react.js';
import Constraints from './FieldConstraints';
import Validator from './FormValidator';

class Form extends Components.ContextComponent {
  static propTypes = {
    bankAccount: PropTypes.object.isRequired,
    errors: React.PropTypes.object
  };

  static defaultProps = { errors: {} };

  constructor(props, context) {
    super(props, context);

    this.state = { bankAccount: this.props.bankAccount, errors: this.props.errors };

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
    if (nextProps.bankAccount)
      this.setState({ bankAccount: nextProps.bankAccount, errors: nextProps.errors || {} });

    this.constraints = new Constraints(nextContext.i18n);
  }

  handleChange(fieldName, event) {
    const value = event && event.target ? event.target.value : event;

    this.setState({ bankAccount: { ...this.state.bankAccount, [fieldName]: value } });
  }

  setFieldErrorsStates(errors) {
    this.setState({
      errors: Object.keys(errors).reduce((rez, fieldName) => ({
        ...rez,
        [fieldName]: errors[fieldName].map(msg => ({ message: msg }))
      }), this.state.errors)
    });
  }

  handleBlur(fieldName) {
    const constraints = this.constraints.forField(fieldName);

    this.setState({
      errors: Object.keys(constraints).reduce((rez, fieldName) => ({
        ...rez,
        [fieldName]: []
      }), this.state.errors)
    });

    const validator = new Validator(constraints);

    validator.validate(this.state.bankAccount).then(null, this.setFieldErrorsStates.bind(this));
  }

  validate() {
    const validator = new Validator(this.constraints.all);

    return validator.validate(this.state.bankAccount);
  }

  renderField(attrs) {
    const { bankAccount, errors } = this.state;
    const { fieldName } = attrs;
    const constraints = this.constraints.all;

    let component = attrs.component ||
      <input className='form-control'
        type='text'
        value={ typeof bankAccount[fieldName] === 'string' ? bankAccount[fieldName] : '' }
        onChange={ this.handleChange.bind(this, fieldName) }
        onBlur={ this.handleBlur.bind(this, fieldName) }
      />;

    return (
      <FormRow
        labelText={ this.context.i18n.getMessage(`BusinessPartner.BankAccount.Label.${fieldName}`) }
        required={ Boolean(constraints[fieldName] && constraints[fieldName].presence) }
        marked = { attrs.marked }
        info={ attrs.info }
        rowErrors={ errors[fieldName] || [] }
      >
        { component }
      </FormRow>
    );
  }

  render() {
    const { bankAccount } = this.state;
    const { i18n } = this.context;

    return (
      <div className='form-horizontal'>
        { this.renderField({ fieldName: 'bankName' }) }
        { this.renderField({
          fieldName: 'accountNumber',
          marked: true,
          info: i18n.getMessage('BusinessPartner.BankAccount.Message.identifierRequired')
        }) }
        { this.renderField({ fieldName: 'bankIdentificationCode' }) }
        { this.renderField({ fieldName: 'bankCode' }) }
        { this.renderField({
          fieldName: 'bankCountryKey',
          component: (
            <this.CountryField
              value={bankAccount.bankCountryKey}
              onChange={this.handleChange.bind(this, 'bankCountryKey')}
              onBlur={this.handleBlur.bind(this, 'bankCountryKey')}
              optional={true}
            />
          )
        })}
        { this.renderField({ fieldName: 'extBankControlKey' }) }
        { this.renderField({ fieldName: 'bankgiro', marked: true }) }
        { this.renderField({ fieldName: 'plusgiro', marked: true }) }
        { this.renderField({ fieldName: 'isrNumber' }) }
        <p>{i18n.getMessage('BusinessPartner.BankAccount.Message.identifierRequired')}</p>
      </div>
    );
  }
};

export default Form;
