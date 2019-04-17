import { Components } from '@opuscapita/service-base-ui';
import React, { PropTypes } from 'react';

let getConfigType = (config, order, type) => {
  if (!order) return false;

  return Boolean(config[type]);
}

class OrderConfigEditForm extends Components.ContextComponent {
  static propTypes = {
    config: PropTypes.object,
    orderAbailable: PropTypes.bool.isRequired,
    onConfigChange: PropTypes.func.isRequired
  };

  static defaultProps = { config: {} };

  constructor(props) {
    super(props);

    const config = props.config;
    const orderAbailable = props.orderAbailable;
    this.state = {
      bnp: getConfigType(config, orderAbailable, 'bnp'),
      direct_integration: getConfigType(config, orderAbailable, 'direct_integration')
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      bnp: getConfigType(nextProps.config, nextProps.orderAbailable, 'bnp'),
      direct_integration: getConfigType(nextProps.config, nextProps.orderAbailable, 'direct_integration')
    });
  }

  async handleCheckboxChange(type) {
    await this.setState({ [type]: !this.state[type] });

    const { bnp, direct_integration } = this.state;
    this.props.onConfigChange({ bnp, direct_integration });
  }

  render() {
    return (
      <div>
        {['bnp', 'direct_integration'].map(type =>
          <p key={type}>
            <input
              className='fa fa-fw' type='checkbox'
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

export default OrderConfigEditForm;
