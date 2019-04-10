import React, { PropTypes, Component } from 'react';
import AttributeValueEditorRow from '../../AttributeValueEditorRow.react.js';
import ActionButton from '../../ActionButton.react';
import BusinessPartnerVisibility from '../../../models/BusinessPartnerVisibility';

class VisibilityForm extends Component {
  static propTypes = {
    visibility: PropTypes.object.isRequired,
    onUpdate: React.PropTypes.func.isRequired
  };

  static contextTypes = {
    i18n : React.PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);

    const visibility = props.visibility;
    if (!visibility.contacts) visibility.contacts = BusinessPartnerVisibility.PRIVATE;
    if (!visibility.bankAccounts) visibility.bankAccounts = BusinessPartnerVisibility.PRIVATE;
    this.state = { visibility: visibility };
  }

  handleChange = (fieldName, event) => {
    let newValue = event.target.value;

    this.setState({ visibility: { ...this.state.visibility, [fieldName]: newValue } });
  };

  handleUpdate = event => {
    event.preventDefault();

    this.props.onUpdate(this.state.visibility);
  };

  selectOptions = () => {
    return BusinessPartnerVisibility.TYPES.map(option => {
      const label = this.context.i18n.getMessage(`BusinessPartner.Visibility.Type.${option}`);
      return { value: option, label: label, disabled: false };
    });
  };

  renderField = (attrs) => {
    return (
      <AttributeValueEditorRow labelText={ this.context.i18n.getMessage(`BusinessPartner.Visibility.Label.${attrs.fieldName}`) } >
        { attrs.component }
      </AttributeValueEditorRow>
    );
  };

  render() {
    const { visibility } = this.state;

    return (
      <form className="form-horizontal">
        { this.renderField({
            fieldName: 'contacts',
            component: (
              <select className="form-control"
                value={visibility.contacts}
                onChange={this.handleChange.bind(this, 'contacts')}
              >
                {this.selectOptions().map((item, index) => {
                  return (<option key={index} disabled={item.disabled} value={item.value}>{item.label}</option>);
                })}
              </select>
            )
        }) }
        { this.renderField({
            fieldName: 'bankAccounts',
            component: (
              <select className="form-control"
                value={visibility.bankAccounts}
                onChange={this.handleChange.bind(this, 'bankAccounts')}
              >
                {this.selectOptions().map((item, index) => {
                  return (<option key={index} disabled={item.disabled} value={item.value}>{item.label}</option>);
                })}
              </select>
            )
        }) }
        <div className="text-right visibility-form-submit">
          <ActionButton
            style='primary'
            type='submit'
            onClick={this.handleUpdate.bind(this)}
            label={this.context.i18n.getMessage('BusinessPartner.Button.save')}
          />
        </div>
      </form>
    );
  }
};

export default VisibilityForm;
