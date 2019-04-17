import { Components } from '@opuscapita/service-base-ui';
import React, { PropTypes } from 'react';

let getConfigType = (config, invoice, type) => {
  if (!invoice) return false;

  return Boolean(config[type]);
}

class InvoiceConfigEditForm extends Components.ContextComponent {
  static propTypes = {
    config: PropTypes.object,
    invoiceAbailable: PropTypes.bool.isRequired,
    onConfigChange: PropTypes.func.isRequired
  };

  static defaultProps = {
    config: {}
  };

  constructor(props) {
    super(props);

    const config = props.config;
    const invoiceAbailable = props.invoiceAbailable;
    this.state = {
      keyin: getConfigType(config, invoiceAbailable, 'keyin'),
      einvoice: getConfigType(config, invoiceAbailable, 'einvoice'),
      pdf: getConfigType(config, invoiceAbailable, 'pdf')
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      keyin: getConfigType(nextProps.config, nextProps.invoiceAbailable, 'keyin'),
      einvoice: getConfigType(nextProps.config, nextProps.invoiceAbailable, 'einvoice'),
      pdf: getConfigType(nextProps.config, nextProps.invoiceAbailable, 'pdf')
    });
  }

  async handleCheckboxChange(type) {
    await this.setState({ [type]: !this.state[type] });

    const { keyin, einvoice, pdf } = this.state;
    this.props.onConfigChange({ keyin, einvoice, pdf });
  }

  render() {
    return (
      <div>
        {['keyin', 'einvoice', 'pdf'].map(type =>
          <p key={type}>
            <input
              className='fa fa-fw'
              type='checkbox'
              onChange={this.handleCheckboxChange.bind(this, type)}
              checked={this.state[type]}
            />
            {this.context.i18n.getMessage(`BusinessLink.Connections.Config.${type}`)}
          </p>
        )}
      </div>
    );
  }
};

export default InvoiceConfigEditForm;
