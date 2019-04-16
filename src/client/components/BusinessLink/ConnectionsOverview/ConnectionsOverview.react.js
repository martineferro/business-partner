import { BusinessLink } from '../../../api';
import React, { PropTypes, Component } from 'react';
import locales from '../../../i18n';
import './ConnectionsOverview.css';
import BusinessLinkModel from '../../../models/BusinessLink';
const CONNECTION = BusinessLinkModel.CONNECTION;
const STATUS = BusinessLinkModel.STATUS;

export default class ConnectionsOverview extends Component {
  constructor(props) {
    super(props);
    this.state = { businessLinks: [] };
    this.businessLinkApi = new BusinessLink();
  }

   static contextTypes = {
    i18n : PropTypes.object.isRequired
  };

  static propTypes = {
    supplierId: PropTypes.string.isRequired,
    onInvoiceClick: PropTypes.func.isRequired,
    onPurchaseOrderClick: PropTypes.func.isRequired,
    onCatalogClick: PropTypes.func.isRequired
  };

  componentWillMount() {
    this.context.i18n.register('BusinessLink', locales);
  }

  componentDidMount() {
    this.businessLinkApi.allForSupplierId(this.props.supplierId).
      then(businessLinks => this.setState({ businessLinks: businessLinks }));
  }

  componentWillReceiveProps(nextProps, nextContext){
    if(nextContext.i18n) nextContext.i18n.register('BusinessLink', locales);
  }

  handleClick(connectionType, event) {
    event.preventDefault();

    if (connectionType === CONNECTION.INVOICE) this.props.onInvoiceClick();
    if (connectionType === CONNECTION.ORDER) this.props.onPurchaseOrderClick();
    if (connectionType === CONNECTION.CATALOG) this.props.onCatalogClick();
  }

  connectionsFor(connType) {
    return this.state.businessLinks.filter(bl => {
      return bl.connections.some(cn => cn.status === STATUS.CONNECTED && cn.type === connType);
    });
  }

  statusFor(connections) {
    if (connections.length > 0) return 'configured';

    return 'pending';
  }

  colorStyle(connections) {
    if (connections.length > 0) return { color: 'green' };

    return { color: 'red' };
  }

  renderStatusText(connections) {
    return (
      <span style={this.colorStyle(connections)}>
        {this.context.i18n.getMessage(`BusinessLink.Status.${this.statusFor(connections)}`)}
      </span>
    );
  }

  renderOverview(connectionType) {
    const connections = this.connectionsFor(connectionType);
    const { i18n } = this.context;
    return (
      <div>
        <h4><em>{i18n.getMessage(`BusinessLink.Overview.${connectionType}`)}</em></h4>
        <div>{i18n.getMessage('BusinessLink.Overview.status')}: {this.renderStatusText(connections)}</div>
        <button className="btn btn-link connection-count" onClick={this.handleClick.bind(this, connectionType)}>
          {`${i18n.getMessage('BusinessLink.Overview.connectedCustomers')}: ${connections.length}`}
        </button>
      </div>
    );
  }

  render() {
    return (
      <div className="row">
        <div className="col-md-6">{this.renderOverview(CONNECTION.INVOICE)}</div>
        <div className="col-md-6">{this.renderOverview(CONNECTION.ORDER)}</div>
        <div className="col-md-6">{this.renderOverview(CONNECTION.CATALOG)}</div>
      </div>
    );
  }
};
