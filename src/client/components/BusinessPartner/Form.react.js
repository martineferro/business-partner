import React, { PropTypes } from 'react';
import { Components } from '@opuscapita/service-base-ui';
import FormRow from '../AttributeValueEditorRow.react.js';
import ActionButton from '../ActionButton.react.js';
import './BusinessPartner.css';
import DateInput from '@opuscapita/react-dates/lib/DateInput';
import Autocomplete from './Autocomplete';
import { BusinessPartner } from '../../api';
import Validator from './FormValidator.js';
import Constraints from './FieldConstraints';
import formHelper from './formHelper';
import FormAction from './FormAction';

class Form extends Components.ContextComponent {
  static propTypes = {
    businessPartner: PropTypes.object.isRequired,
    onAction: PropTypes.func.isRequired,
    onChange: PropTypes.func,
    onCancel: PropTypes.func,
    action: PropTypes.oneOf(FormAction.TYPES).isRequired
  };

  constructor(props, context) {
    super(props, context);

    this.state = {
      businessPartner: this.props.businessPartner,
      businessPartnerParent: null,
      fieldErrors: {},
      isFin: false,
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
    this.constraints = new Constraints(this.context.i18n, this.props.action);
    this.formAction = new FormAction(this.props.action, this.context.i18n);
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if (JSON.stringify(this.props.businessPartner) !== JSON.stringify(nextProps.businessPartner)) {
      this.setState({
        businessPartner: nextProps.businessPartner,
        fieldErrors: {},
        hasVATId: Boolean(nextProps.businessPartner.vatIdentificationNo)
      });
    }

    this.constraints = new Constraints(nextContext.i18n, nextProps.action);
    this.formAction = new FormAction(nextProps.action, nextContext.i18n);
  }

  componentDidMount() {
    if (!this.state.businessPartner.parentId) return;

    this.api.find(this.state.businessPartner.parentId).then(parent => this.setState({ businessPartnerParent: parent }));
  }

  setFieldErrorsStates = (errors) => {
    this.setState({
      fieldErrors: Object.keys(errors || {}).reduce((rez, fieldName) => ({
        ...rez,
        [fieldName]: errors[fieldName].map(error => this.formAction.getError(error, fieldName))
      }), this.state.fieldErrors)
    });
  };

  handleChange = (fieldName, event) => {

    const newValue = formHelper.getEventValue(event);

    if (this.props.onChange) this.props.onChange(fieldName, this.state.businessPartner[fieldName], newValue);
    if (fieldName === 'countryOfRegistration' && newValue === 'FI' || fieldName != 'countryOfRegistration' && this.state.businessPartner.countryOfRegistration === 'FI') {
      this.setState({
        businessPartner: { ...this.state.businessPartner, [fieldName]: newValue },
        isFin: true,
        hasVATId: true
      });

    }
    else {
      this.setState({
        businessPartner: { ...this.state.businessPartner, [fieldName]: newValue },
        isFin: false
      });
    }


  };

  handleBlur = (fieldName, event) => {
    event.preventDefault && event.preventDefault();
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

    const validator = new Validator(this.context.i18n, constraints, this.formAction.validatorType());
    validator.validate(this.state.businessPartner).then(null, error);
  };

  handleCancel = event => {
    event.preventDefault();
    this.props.onCancel();
  };

  handleAction = event => {
    event.preventDefault();

    const { onAction } = this.props;
    const businessPartner = this.state.businessPartner;

    if (businessPartner.countryOfRegistration === 'FI' && !businessPartner.vatIdentificationNo && !businessPartner.ovtNo) {
      this.setFieldErrorsStates(
        {
          vatIdentificationNo: ["Do something!"],
          ovtNo: ["ovtNo Do something!"]
        });
    } else if (businessPartner.countryOfRegistration === 'FI' && !businessPartner.vatIdentificationNo) {
      this.setFieldErrorsStates(
        {
          vatIdentificationNo: ["Do something!"],
        });
    } else if (businessPartner.countryOfRegistration === 'FI' && !businessPartner.ovtNo) {
      this.setFieldErrorsStates(
        {
          ovtNo: ["ovtNo Do something!"]
        });
    }
    else if (!businessPartner.vatIdentificationNo && this.state.hasVATId) {
      this.setFieldErrorsStates({ noVatReason: [this.context.i18n.getMessage('BusinessPartner.Messages.clickCheckBox')] });

    }
    else {
      const success = () => {
        businessPartner.noVatReason = businessPartner.vatIdentificationNo ? null : 'No VAT Registration Number';
        onAction(businessPartner);
      };

      const error = (errors) => {
        this.setFieldErrorsStates(errors);
        onAction(null);
      };

      const validator = new Validator(this.context.i18n, this.constraints.fetch(), this.formAction.validatorType());
      validator.validate(businessPartner).then(success, error);
    }
  };

  handleCheckboxChange = () => {
    console.log('CheckBox Triggered', this.state.businessPartner.countryOfRegistration, this.state.isFin);

    this.setFieldErrorsStates({ noVatReason: [] });
    this.setState({ hasVATId: !this.state.hasVATId });

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
  };

  handleAccessRequest = (error) => {
    if (this.props.onAccessRequest) this.props.onAccessRequest(error.attributes);
  };

  userIsAdmin = () => this.context.userData.roles.includes('admin');

  renderField = (attrs) => {
    const { businessPartner, fieldErrors } = this.state;
    const { fieldName } = attrs;
    const fieldNames = attrs.fieldNames || [fieldName];
    const constraints = this.constraints.fetch();

    let component = attrs.component ||
      <input className="form-control"
        type="text"
        value={typeof businessPartner[fieldName] === 'string' ? businessPartner[fieldName] : ''}
        onChange={this.handleChange.bind(this, fieldName)}
        onBlur={this.handleBlur.bind(this, fieldName)}
        disabled={attrs.disabled || false}
      />;

    let isRequired = fieldNames.some(name => {
      return constraints[name] && constraints[name].presence;
    });

    let rowErrors = fieldNames.reduce((rez, name) => rez.concat(fieldErrors[name] || []), []);

    return (
      <FormRow
        key={fieldName}
        labelText={attrs.labelText || this.context.i18n.getMessage(`BusinessPartner.Label.${fieldName}`)}
        required={isRequired}
        marked={attrs.marked}
        info={attrs.info}
        rowErrors={rowErrors}
        helpText={this.formAction.getHelperText(attrs.helpText)}
        onErrorLinkClick={this.handleAccessRequest}
      >
        {component}
      </FormRow>
    );
  };

  renderAdminFields = () => {
    if (!this.userIsAdmin()) return null;
    return (
      <div>
        {this.formAction.fieldsForAdmin().map(field => this.fields[field])}
      </div>
    );
  };

  render() {
    const i18n = this.context.i18n;
    const { businessPartner } = this.state;

    return (
      <form className="form-horizontal business-partner-form">
        <div className="row">
          <div className="col-md-6">
            {this.renderAdminFields()}
            {this.formAction.fieldsForUser().map(field => this.fields[field])}
          </div>
          <div className="col-md-6">
            {this.formAction.helpInformation()}
            {this.formAction.fieldsForIdentifiers().map(field => this.fields[field])}
          </div>
        </div>
        <div className='business-partner-form-submit'>
          <div className='text-right form-submit'>
            {this.formAction.actionButtons().map(button => this.formActionButtons[button])}
          </div>
        </div>
      </form>
    );
  }

  get fields() {
    const { businessPartner, businessPartnerParent } = this.state;
    const { i18n } = this.context;

    return {
      managed: this.renderField({
        fieldName: 'managed',
        component: (
          <input
            className='fa fa-fw business-partner-checkbox'
            type='checkbox'
            onChange={this.handleManagedChange}
            checked={!businessPartner.managed}
          ></input>
        )
      }),
      isSupplier: this.renderField({
        fieldName: 'isSupplier',
        component: (
          <input
            className='fa fa-fw business-partner-checkbox'
            type='checkbox'
            onChange={this.handleTypeChange.bind(this, 'isSupplier')}
            checked={businessPartner.isSupplier}
          ></input>
        )
      }),
      isCustomer: this.renderField({
        fieldName: 'isCustomer',
        component: (
          <input
            className='fa fa-fw business-partner-checkbox'
            type='checkbox'
            onChange={this.handleTypeChange.bind(this, 'isCustomer')}
            checked={businessPartner.isCustomer}
          ></input>
        )
      }),
      id: this.renderField({
        fieldName: 'id',
        disabled: !this.formAction.isCreate()
      }),
      parentId: this.renderField({
        fieldName: 'parentId',
        component: (
          <Autocomplete
            value={businessPartnerParent}
            onChange={this.handleParentChange}
            onBlur={() => null}
            disabled={!this.userIsAdmin()}
            onFilter={bp => bp.id !== businessPartner.id}
          />
        )
      }),
      entityCode: this.renderField({ fieldName: 'entityCode' }),
      name: this.renderField({ fieldName: 'name' }),
      homePage: this.renderField({ fieldName: 'homePage' }),
      foundedOn: this.renderField({
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
      }),
      legalForm: this.renderField({ fieldName: 'legalForm' }),
      cityOfRegistration: this.renderField({
        fieldName: 'cityOfRegistration',
        helpText: i18n.getMessage('BusinessPartner.Messages.cityOfRegistration.helpText')
      }),
      countryOfRegistration: this.renderField({
        fieldName: 'countryOfRegistration',
        helpText: i18n.getMessage('BusinessPartner.Messages.countryOfRegistration.helpText'),
        component: (
          <this.CountryField
            value={businessPartner.countryOfRegistration || ''}
            onChange={this.handleChange.bind(this, 'countryOfRegistration')}
            onBlur={this.handleBlur.bind(this, 'countryOfRegistration')}
          />
        )
      }),
      currencyId: this.renderField({
        fieldName: 'currencyId',
        component: (
          <this.CurrencyField
            optional={true}
            value={businessPartner.currencyId || ''}
            onChange={this.handleChange.bind(this, 'currencyId')}
            onBlur={this.handleBlur.bind(this, 'currencyId')}
          />
        )
      }),
      commercialRegisterNo: this.renderField({
        fieldName: 'commercialRegisterNo',
        info: formHelper.comRegTooltiptext(i18n),
        helpText: i18n.getMessage('BusinessPartner.Messages.companyRegisterNumber.helpText')
      }),
      taxIdentificationNo: this.renderField(
        { fieldName: 'taxIdentificationNo' }),
      vatIdentificationNo: this.renderField({
        fieldName: 'vatIdentificationNo',
        disabled: (!this.formAction.isRegister() && !this.userIsAdmin()) || (this.formAction.isRegister() && Boolean(this.props.businessPartner.vatIdentificationNo)),
        reguired: this.state.isFin
      }),
      noVatReason: this.renderField({
        fieldName: 'noVatReason',
        labelText: ' ',
        component: (
          <p>
            <input
              className='fa fa-fw'
              type='checkbox'
              onChange={this.handleCheckboxChange}
              checked={!this.state.hasVATId}
              disabled={this.state.isFin || (!this.formAction.isRegister() && !this.userIsAdmin()) || (this.formAction.isRegister() && Boolean(this.props.businessPartner.vatIdentificationNo))}
            ></input>
            {i18n.getMessage('BusinessPartner.Messages.noVatId')}
          </p>
        )
      }),
      globalLocationNo: this.renderField({
        fieldName: 'globalLocationNo',
        marked: true,
        disabled: (!this.formAction.isRegister() && !this.userIsAdmin()) || (this.formAction.isRegister() && Boolean(this.props.businessPartner.globalLocationNo))
      }),
      dunsNo: this.renderField({
        fieldName: 'dunsNo',
        marked: true,
        disabled: (!this.formAction.isRegister() && !this.userIsAdmin()) || (this.formAction.isRegister() && Boolean(this.props.businessPartner.dunsNo))
      }),
      ovtNo: this.renderField({
        fieldName: 'ovtNo',
        marked: true,
        disabled: (!this.formAction.isRegister() && !this.userIsAdmin()) || (this.formAction.isRegister() && Boolean(this.props.businessPartner.ovtNo)),
        reguired: this.state.isFin
      }),
      iban: this.renderField({ fieldName: 'iban', marked: true })
    };
  }

  get formActionButtons() {
    const { i18n } = this.context;
    return {
      save: <ActionButton
        key='save'
        id='business-partner-editor__form-submit'
        style='primary'
        onClick={this.handleAction}
        label={i18n.getMessage('BusinessPartner.Button.save')}
      />,
      continue: <ActionButton
        key='continue'
        id='supplier-registration__continue'
        style='primary'
        onClick={this.handleAction}
        label={i18n.getMessage('BusinessPartner.Button.continue')}
      />,
      cancel: <ActionButton
        key='cancel'
        id='supplier-registration__cancel'
        style='link'
        onClick={this.handleCancel}
        label={i18n.getMessage('BusinessPartner.Button.cancel')}
      />
    }
  }
}

export default Form;
