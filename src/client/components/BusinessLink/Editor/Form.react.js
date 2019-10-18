import { Customer, Supplier } from '../../../api';
import React, { PropTypes } from 'react';
import FormRow from '../../AttributeValueEditorRow.react.js';
import BusinessPartnerAutocomplete from '../../BusinessPartner/Autocomplete';
import FieldConstraints from './FieldConstraints';
import FormValidator from './FormValidator';
import { Components } from '@opuscapita/service-base-ui';
import InvoiceConfigEditForm from './InvoiceConfigEditForm.react';
import OrderConfigEditForm from './OrderConfigEditForm.react';
import BusinessLinkModel from '../../../models/BusinessLink';
const CONNECTION = BusinessLinkModel.CONNECTION;
const STATUS = BusinessLinkModel.STATUS;


let hasConnectionType = (businessLink, type) => {
  return Boolean(businessLink.connections && businessLink.connections.some(con => con.type === type));
};

let getConnectionConfig = (businessLink, type) => {
  if (!businessLink.connections) return {};

  const connection = businessLink.connections.find(con => con.type === type);
  if (!connection) return {};

  return JSON.parse(connection.config) || {};
};

let setStates = (businessLink) => {
  return {
    businessLink: businessLink,
    invoice: hasConnectionType(businessLink, CONNECTION.INVOICE),
    order: hasConnectionType(businessLink, CONNECTION.ORDER),
    catalog: hasConnectionType(businessLink, CONNECTION.CATALOG),
    invoiceConfig: getConnectionConfig(businessLink, CONNECTION.INVOICE),
    orderConfig: getConnectionConfig(businessLink, CONNECTION.ORDER),
    customer: businessLink.customer,
    supplier: businessLink.supplier,
    errors: {}
  };
};

class BusinessLinkEditorForm extends Components.ContextComponent {
  static propTypes = {
    mode: PropTypes.string,
    businessLink: PropTypes.object,
    onBusinessLinkUpate: PropTypes.func.isRequired,
    onCancel: React.PropTypes.func
  };

  constructor(props, context) {
    super(props, context);

    this.state = setStates(props.businessLink);
  }

  componentWillMount() {
    this.constraints = new FieldConstraints(this.context.i18n);
  }

  async componentWillReceiveProps(nextProps, nextContext) {
    this.constraints = new FieldConstraints(nextContext.i18n);

    this.setState(setStates(nextProps.businessLink));
  }

  getBusinessPartnerId(businessPartnerType) {
    return this.state[businessPartnerType] && this.state[businessPartnerType].id
  }

  businessLinkToValidate() {
    return {
      ...this.state.businessLink,
      supplierId: this.getBusinessPartnerId('supplier'),
      customerId: this.getBusinessPartnerId('customer')
    };
  }

  getBusinessLink() {
    let connections = [];
    const { invoice, order, catalog, invoiceConfig, orderConfig } = this.state;

    if (invoice) connections.push({ type: CONNECTION.INVOICE, status: STATUS.CONNECTED, config: invoiceConfig });
    if (order) connections.push({ type: CONNECTION.ORDER, status: STATUS.CONNECTED, config: orderConfig });
    if (catalog) connections.push({ type: CONNECTION.CATALOG, status: STATUS.CONNECTED });

    return { ...this.businessLinkToValidate(), status: STATUS.CONNECTED, connections: connections };
  }

  handleBusinessPartnerChange = (bpType, partner) => this.setState({ [bpType]: partner });

  handleChange = (fieldName, event) => {
    this.setState({ businessLink: { ...this.state.businessLink, [fieldName]: event.target.value } });
  };

  handleConnectionCheckboxChange = (connectionType) => {
    this.setState({ [connectionType]: !this.state[connectionType] });
  };

  handleConfigChange = (connectionType, config) => {
    this.setState({ [`${connectionType}Config`]: config });
  };

  handleBlur = (fieldName) => {
    const constraints = this.constraints.forField(fieldName);
    
    this.setState({
      errors: Object.keys(constraints).reduce((rez, fieldName) => ({
        ...rez,
        [fieldName]: []
      }), this.state.errors)
    });

    let error = (errors) => this.setErrorStates(errors);;

    const validator = new FormValidator(constraints)
    validator.validate(this.businessLinkToValidate()).then(null, error);
  };

  handleUpdate = (event) => {
    event.preventDefault();

    const success = () => this.props.onBusinessLinkUpate(this.getBusinessLink());

    const error = (errors) => this.setErrorStates(errors);

    const validator = new FormValidator(this.constraints.all);
    validator.validate(this.businessLinkToValidate()).then(success, error);
  };

  setErrorStates(errors) {
    this.setState({
      errors: Object.keys(errors).reduce((rez, fieldName) => ({
        ...rez,
        [fieldName]: errors[fieldName].map(msg => ({ message: msg }))
      }), this.state.errors)
    });
  }

  renderField(attrs) {
    const { businessLink, errors } = this.state;
    const { fieldName, labelText } = attrs;
    const constraints = this.constraints.constraints;

    let component = attrs.component ||
      <input className="form-control"
        type="text"
        value={ typeof businessLink[fieldName] === 'string' ? businessLink[fieldName] : '' }
        onChange={ this.handleChange.bind(this, fieldName) }
        onBlur={ this.handleBlur.bind(this, fieldName) }
      />;

    return (
      <FormRow
        labelText={ labelText || this.context.i18n.getMessage(`BusinessLink.Label.${fieldName}`) }
        required={ Boolean(constraints[fieldName] && constraints[fieldName].presence) }
        rowErrors={ errors[fieldName] || [] }
      >
        { component }
      </FormRow>
    );
  }

  render() {
    return (
      <form className="form-horizontal">
        { this.renderField({
          fieldName: 'supplierId',
          component: (
            <BusinessPartnerAutocomplete
              value={this.state.supplier}
              onChange={this.handleBusinessPartnerChange.bind(this, 'supplier')}
              onBlur={this.handleBlur.bind(this, 'supplierId')}
              disabled={this.props.mode === 'update'}
              onFilter={bPartner => Boolean(bPartner.isSupplier)}
            />
          )
        })}
        { this.renderField({
          fieldName: 'customerId',
          component: (
            <BusinessPartnerAutocomplete
              value={this.state.customer}
              onChange={this.handleBusinessPartnerChange.bind(this, 'customer')}
              onBlur={this.handleBlur.bind(this, 'customerId')}
              disabled={this.props.mode === 'update'}
              onFilter={bPartner => Boolean(bPartner.isCustomer)}
            />
          )
        })}
        { this.renderField({ fieldName: 'customerSupplierId' }) }
        { this.renderField({
          fieldName: 'connections',
          component: (
            <div>
              <div style={{ marginTop: '5px' }}>
                <input
                  className='fa fa-fw'
                  type='checkbox'
                  onChange={this.handleConnectionCheckboxChange.bind(this, 'invoice')}
                  checked={this.state.invoice}
                />
                {this.context.i18n.getMessage('BusinessLink.Connections.Type.invoice')}
                <div className="row">
                  <div className="col-xs-11 col-xs-offset-1">
                    <InvoiceConfigEditForm
                      invoiceAbailable={this.state.invoice}
                      config={ this.state.invoiceConfig }
                      onConfigChange={ this.handleConfigChange.bind(this, 'invoice') }
                    />
                  </div>
                </div>
              </div>
              <div>
                <input
                  className='fa fa-fw'
                  type='checkbox'
                  onChange={this.handleConnectionCheckboxChange.bind(this, 'order')}
                  checked={this.state.order}
                />
                {this.context.i18n.getMessage('BusinessLink.Connections.Type.order')}
                <div className="row">
                  <div className="col-xs-11 col-xs-offset-1">
                    <OrderConfigEditForm
                      orderAbailable={this.state.order}
                      config={ this.state.orderConfig }
                      onConfigChange={ this.handleConfigChange.bind(this, 'order') }
                    />
                  </div>
                </div>
              </div>
              <div>
                <input
                  className='fa fa-fw'
                  type='checkbox'
                  onChange={this.handleConnectionCheckboxChange.bind(this, 'catalog')}
                  checked={this.state.catalog}
                />
                {this.context.i18n.getMessage('BusinessLink.Connections.Type.catalog')}
              </div>
            </div>
          )
        }) }

        <div>
          <div className='text-right form-submit'>
            <button id='businessLink-editor__form-submit' className="btn btn-primary" onClick={ this.handleUpdate }>
              { this.context.i18n.getMessage(`BusinessPartner.Button.${this.props.mode}`) }
            </button>
          </div>
        </div>
      </form>
    );
  }
};

export default BusinessLinkEditorForm;
