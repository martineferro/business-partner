import React, { PropTypes } from 'react';
import { Components } from '@opuscapita/service-base-ui';
import FormRow from '../AttributeValueEditorRow.react.js';
import './BusinessPartner.css';
import DateInput from '@opuscapita/react-dates/lib/DateInput';
import Autocomplete from './Autocomplete';
import { BusinessPartner } from '../../api';
import Validator from './FormValidator.js';
import Constraints from './FieldConstraints';

class Form extends Components.ContextComponent {
  static propTypes = {
    businessPartner: PropTypes.object.isRequired,
    onUpdate: PropTypes.func.isRequired,
    onChange: PropTypes.func,
    onCancel: PropTypes.func,
    action: PropTypes.oneOf(['create', 'update']).isRequired
  };

  constructor(props, context) {
    super(props, context);

    this.state = {
      businessPartner: this.props.businessPartner,
      businessPartnerParent: null,
      fieldErrors: {},
      hasVATId: Boolean(this.props.businessPartner.vatIdentificationNo)
    };
    this.api = new BusinessPartner();

    this.CountryField = context.loadComponent({
      serviceName: 'isodata',
      moduleName: 'isodata-countries',
      jsFileName: 'countries-bundle'
    });

    this.CurrencyField = context.loadComponent({
      serviceName: 'isodata',
      moduleName: 'isodata-currencies',
      jsFileName: 'currencies-bundle'
    });
  }

  componentWillMount() {
    this.constraints = new Constraints(this.context.i18n);
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if (JSON.stringify(this.props.businessPartner) !== JSON.stringify(nextProps.businessPartner)) {
      this.setState({
        businessPartner: nextProps.businessPartner,
        fieldErrors: {},
        hasVATId: Boolean(nextProps.businessPartner.vatIdentificationNo)
      });
    }

    this.constraints = new Constraints(nextContext.i18n);
  }

  componentDidMount() {
    if (!this.state.businessPartner.parentId) return;

    this.api.find(this.state.businessPartner.parentId).then(parent => this.setState({ businessPartnerParent: parent }));
  }

  setFieldErrorsStates = (errors) => {
    this.setState({
      fieldErrors: Object.keys(errors).reduce((rez, fieldName) => ({
        ...rez,
        [fieldName]: errors[fieldName].map(msg => ({ message: msg }))
      }), this.state.fieldErrors)
    });
  };

  handleChange = (fieldName, event) => {
    let newValue;

    if (event && event.target) {
      newValue = event.target.value;
    } else {
      newValue = event;
    }

    if (this.props.onChange) {
      this.props.onChange(fieldName, this.state.businessPartner[fieldName], newValue);
    }

    this.setState({
      businessPartner: {
        ...this.state.businessPartner,
        [fieldName]: newValue
      }
    });
  };

  handleBlur = (fieldName) => {
    let constraints = this.constraints.forField(fieldName);

    this.setState({
      fieldErrors: Object.keys(constraints).reduce((rez, fieldName) => ({
        ...rez,
        [fieldName]: []
      }), this.state.fieldErrors)
    });

    const error = (errors) => {
      this.setFieldErrorsStates(errors);
    };

    if (this.props.action === 'update') constraints.id = {};
    constraints.parentId = {};

    const validator = new Validator(this.context.i18n, constraints);
    validator.validate(this.state.businessPartner).then(null, error);
  };

  handleCancel = event => {
    event.preventDefault();
    this.props.onCancel();
  };

  handleUpdate = event => {
    event.preventDefault();

    const { onUpdate } = this.props;
    const businessPartner = this.state.businessPartner;
    let constraints = { ...this.constraints.forUpdate(), id: {}, parentId: {} };

    if (this.props.action === 'create') constraints = { ...this.constraints.forCreate(), parentId: {} };

    if (!businessPartner.vatIdentificationNo && this.state.hasVATId) {
      this.setFieldErrorsStates({ noVatReason: [this.context.i18n.getMessage('BusinessPartner.Messages.clickCheckBox')] });
    } else {
      const success = () => {
        businessPartner.noVatReason = businessPartner.vatIdentificationNo ? null : 'No VAT Registration Number';
        onUpdate(businessPartner);
      };

      const error = (errors) => {
        this.setFieldErrorsStates(errors);
        onUpdate(null);
      };

      const validator = new Validator(this.context.i18n, constraints);
      validator.validate(businessPartner).then(success, error);
    }
  };

  handleCheckboxChange = () => {
    this.setFieldErrorsStates({ noVatReason: [] });
    this.setState({hasVATId: !this.state.hasVATId});
  };

  handleManagedChange = () => {
    const managed = !this.state.businessPartner.managed;
    if (managed) {
      this.constraints.addPresence('cityOfRegistration');
      this.constraints.addPresence('countryOfRegistration');
    } else {
      this.constraints.removePresence('cityOfRegistration');
      this.constraints.removePresence('countryOfRegistration');
    }

    this.setState({ businessPartner: { ...this.state.businessPartner, managed: managed } });
  };

  handleParentChange = (parent) => {
    this.setState({
      businessPartnerParent: parent,
      businessPartner: { ...this.state.businessPartner, parentId: parent && parent.id }
    });
  };

  handleTypeChange = (field) => {
    const change = !this.state.businessPartner[field];
    this.setState({ businessPartner: { ...this.state.businessPartner, [field]: change } });
  }

  userIsAdmin = () => this.context.userData.roles.includes('admin');

  comRegTooltiptext() {
    return (
      `${this.context.i18n.getMessage('BusinessPartner.Messages.companyRegisterNumber.text')}
      <ul>
        <li>${this.context.i18n.getMessage('BusinessPartner.Messages.companyRegisterNumber.de')}</li>
        <li>${this.context.i18n.getMessage('BusinessPartner.Messages.companyRegisterNumber.at')}</li>
        <li>${this.context.i18n.getMessage('BusinessPartner.Messages.companyRegisterNumber.fi')}</li>
        <li>${this.context.i18n.getMessage('BusinessPartner.Messages.companyRegisterNumber.se')}</li>
        <li>${this.context.i18n.getMessage('BusinessPartner.Messages.companyRegisterNumber.no')}</li>
        <li>${this.context.i18n.getMessage('BusinessPartner.Messages.companyRegisterNumber.ch')}</li>
        <li>${this.context.i18n.getMessage('BusinessPartner.Messages.companyRegisterNumber.us')}</li>
        <li>${this.context.i18n.getMessage('BusinessPartner.Messages.companyRegisterNumber.pl')}</li>
        <li>${this.context.i18n.getMessage('BusinessPartner.Messages.companyRegisterNumber.fr')}</li>
      </ul>`
    );
  }

  renderField = (attrs) => {
    const { businessPartner, fieldErrors } = this.state;
    const { fieldName } = attrs;
    const fieldNames = attrs.fieldNames || [fieldName];
    const constraints = this.constraints.forUpdate();

    let component = attrs.component ||
      <input className="form-control"
        type="text"
        value={ typeof businessPartner[fieldName] === 'string' ? businessPartner[fieldName] : '' }
        onChange={ this.handleChange.bind(this, fieldName) }
        onBlur={ this.handleBlur.bind(this, fieldName) }
        disabled={ attrs.disabled || false }
      />;

    let isRequired = fieldNames.some(name => {
      return constraints[name] && constraints[name].presence;
    });

    let rowErrors = fieldNames.reduce((rez, name) => rez.concat(fieldErrors[name] || []), []);

    return (
      <FormRow
        labelText={ attrs.labelText || this.context.i18n.getMessage(`BusinessPartner.Label.${fieldName}`) }
        required={ isRequired }
        marked={ attrs.marked }
        info={ attrs.info }
        rowErrors={ rowErrors }
      >
        { component }
      </FormRow>
    );
  };

  renderAdminFields = () => {
    if (!this.userIsAdmin()) return null;

    return (
      <div>
        {this.renderField({
          fieldName: 'managed',
          component: (
            <input
              style={{ marginTop: '5px' }}
              className='fa fa-fw'
              type='checkbox'
              onChange={this.handleManagedChange}
              checked={!this.state.businessPartner.managed}
            ></input>
          )
        })}
        {this.renderField({
          fieldName: 'isSupplier',
          component: (
            <div style={{ marginTop: '5px' }}>
              <input
                className='fa fa-fw'
                type='checkbox'
                onChange={this.handleTypeChange.bind(this, 'isSupplier')}
                checked={this.state.businessPartner.isSupplier}
              ></input>
            </div>
          )
        })}
        {this.renderField({
          fieldName: 'isCustomer',
          component: (
            <div style={{ marginTop: '5px' }}>
              <input
                className='fa fa-fw'
                type='checkbox'
                onChange={this.handleTypeChange.bind(this, 'isCustomer')}
                checked={this.state.businessPartner.isCustomer}
              ></input>
            </div>
          )
        })}
        { this.props.action === 'update' ? null : this.renderField({ fieldName: 'id' }) }
      </div>
    );
  };

  render() {
    const i18n = this.context.i18n;
    const { businessPartner } = this.state;

    return (
      <div>
        <form className="form-horizontal business-partner-form">
          {this.renderAdminFields()}
          {this.renderField({
            fieldName: 'parentId',
            component: (
              <Autocomplete
                value={this.state.businessPartnerParent}
                onChange={this.handleParentChange}
                onBlur={() => null}
                disabled={!this.userIsAdmin()}
                onFilter={ bp => bp.id !== businessPartner.id }
              />
            )
          })}
          { this.renderField({ fieldName: 'entityCode' }) }
          { this.renderField({ fieldName: 'name' }) }
          { this.renderField({ fieldName: 'homePage' }) }
          { this.renderField({
            fieldName: 'foundedOn',
            component: (
              <DateInput
                className="form-control"
                locale={['en', 'de'].includes(i18n.locale) ? i18n.locale : 'en'}
                dateFormat={i18n.dateFormat}
                value={businessPartner.foundedOn ? new Date(businessPartner.foundedOn) : null}
                onChange={this.handleChange.bind(this, 'foundedOn')}
                onBlur={this.handleBlur.bind(this, 'foundedOn')}
                variants={[]}
              />
            )
          }) }

          { this.renderField({ fieldName: 'legalForm' }) }
          { this.renderField({ fieldName: 'cityOfRegistration' }) }
          { this.renderField({
            fieldName: 'countryOfRegistration',
            component: (
              <this.CountryField
                value={this.state.businessPartner.countryOfRegistration || ''}
                onChange={this.handleChange.bind(this, 'countryOfRegistration')}
                onBlur={this.handleBlur.bind(this, 'countryOfRegistration')}
              />
            )
          })}
          { this.renderField({
            fieldName: 'currencyId',
            component: (
              <this.CurrencyField
                optional={true}
                value={this.state.businessPartner.currencyId || ''}
                onChange={this.handleChange.bind(this, 'currencyId')}
                onBlur={this.handleBlur.bind(this, 'currencyId')}
              />
            )
          })}
          { this.renderField({ fieldName: 'commercialRegisterNo', info: this.comRegTooltiptext() }) }
          { this.renderField({ fieldName: 'taxIdentificationNo' }) }
          { this.renderField({ fieldName: 'vatIdentificationNo', marked: true, disabled: !this.userIsAdmin() }) }
          { this.renderField({
                  fieldName: 'noVatReason',
                  labelText: ' ',
                  component: (
                    <p>
                      <input className='fa fa-fw' type='checkbox' onChange={this.handleCheckboxChange} checked={!this.state.hasVATId} disabled={!this.userIsAdmin()}></input>
                      {this.context.i18n.getMessage('BusinessPartner.Messages.noVatId')}
                    </p>
                  )
                }) }
          { this.renderField({ fieldName: 'globalLocationNo', marked: true, disabled: !this.userIsAdmin() }) }
          { this.renderField({ fieldName: 'dunsNo', marked: true, disabled: !this.userIsAdmin() }) }
          { this.renderField({ fieldName: 'ovtNo', marked: true, disabled: !this.userIsAdmin() }) }

          <div className='business-partner-form-submit'>
            <div className='text-right form-submit'>
              <button id='business-partner-editor__form-submit' className="btn btn-primary" onClick={ this.handleUpdate }>
                { i18n.getMessage('BusinessPartner.Button.save') }
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

export default Form;
