import React, { PropTypes, Component } from 'react';
import validator from 'validate.js';
import AttributeValueEditorRow from '../../AttributeValueEditorRow.react.js';
import { BusinessPartner } from '../../../api';

class AccessRequestForm extends Component {
  static propTypes = {
    accessAttributes: PropTypes.object.isRequired,
    onCreateAccess: React.PropTypes.func.isRequired,
    onCancel: React.PropTypes.func.isRequired
  };

  static contextTypes = {
    i18n : React.PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);

    this.state = { businessPartner: {}, accessReason: '', fieldErrors: {} };
    this.businessPartnerApi = new BusinessPartner();
  }

  componentWillMount() {
    this.constraints = {
      accessReason: {
        presence: {
          message: this.context.i18n.getMessage('BusinessPartnerValidatejs.blank.message')
        }
      }
    };
  }

  componentDidMount() {
    this.businessPartnerApi.search(this.props.accessAttributes).then(businessPartner => {
      this.setState({ businessPartner: businessPartner });
    }).catch(error => null);
  }

  setFieldErrorsState = (errors) => {
    this.setState({
      fieldErrors: {
        ...this.state.fieldErrors,
        accessReason: errors ? errors.accessReason.map(msg => ({ message: msg })) : []
      }
    });
  };

  handleBlur = () => {
    const errors = validator({ accessReason: this.state.accessReason }, this.constraints, { fullMessages: false });
    this.setFieldErrorsState(errors);
  };

  handleChange = (event) => {
    this.setState({ accessReason: event.target.value });
  };

  handleCancel = (event) => {
    event.preventDefault && event.preventDefault();
    this.props.onCancel();
  };

  handleCreate = (event) => {
    event.preventDefault && event.preventDefault();

    const { accessReason, businessPartner } = this.state;

    const access = { accessReason: accessReason, businessPartnerId: businessPartner.id };
    const errors = validator(access, this.constraints, { fullMessages: false });
    this.setFieldErrorsState(errors);

    if (!errors) this.props.onCreateAccess(access, businessPartner);
  };

  renderField = (attrs) => {
    const { fieldErrors } = this.state;
    const { isRequired, component, fieldName } = attrs;
    const fieldNames = [fieldName];

    let rowErrors = fieldNames.reduce((rez, name) => rez.concat(fieldErrors[name] || []), []);

    return (
      <AttributeValueEditorRow
        labelText={ this.context.i18n.getMessage(`BusinessPartner.Label.${fieldName}`) }
        required={ isRequired || false }
        rowErrors={ rowErrors }
      >
        { component }
      </AttributeValueEditorRow>
    );
  };

  render() {
    const { accessReason, businessPartner } = this.state;
    const { i18n } = this.context;

    if (!businessPartner.id) return null;

    return (
      <div className="row">
        <div className="col-md-8">
          <form className="form-horizontal">
            <div className="row">
              <div className="col-md-12">
                { this.renderField({ fieldName: 'name', component: <p>{businessPartner.name}</p>}) }
                { this.renderField({
                  fieldName: 'accessReason',
                  isRequired: true,
                  component: (
                    <textarea
                      className="form-control"
                      value={accessReason}
                      onChange={this.handleChange.bind(this)}
                      onBlur={this.handleBlur.bind(this)}
                    />
                  )
                }) }
                <div className='business-partner-registration-form-submit'>
                  <div className='text-right form-submit'>
                    <button className="btn btn-link" onClick={this.handleCancel}>
                      {i18n.getMessage('BusinessPartner.Button.cancel')}
                    </button>
                    <button className="btn btn-primary" onClick={ this.handleCreate }>
                      {i18n.getMessage('BusinessPartner.Button.request')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
        <div className="col-md-4">
          <p>{i18n.getMessage('BusinessPartner.Messages.accessInformation1', { name: businessPartner.name })}</p>
          <p>{i18n.getMessage('BusinessPartner.Messages.accessInformation2')}</p>
          <p>{i18n.getMessage('BusinessPartner.Messages.accessInformation3')}</p>
          <p>{i18n.getMessage('BusinessPartner.Messages.accessInformation4')}</p>
        </div>
      </div>
    );
  }
}

export default AccessRequestForm;
