import { BusinessLink, BusinessPartner } from '../../../api';
import React, { PropTypes } from 'react';
import { Components, System } from '@opuscapita/service-base-ui';
import locales from '../../../i18n';
import Table from '../../Table.react';
import stringHelper from '../../../utils/stringHelper';
import BusinessPartnerModel from '../../../models/BusinessPartner';
import BusinessLinkModel from '../../../models/BusinessLink';
const CONNECTION = BusinessLinkModel.CONNECTION;
const STATUS = BusinessLinkModel.STATUS;

const NOOP = () => { }

export default class Connections extends Components.ContextComponent {
  static propTypes = {
    businessPartnerId: PropTypes.string.isRequired
  };

  constructor(props, context) {
    super(props);
    this.state = {
      connections: [],
      businessPartner: {},
      currentConnection: null,
      loading: true,
      eInvoiceSendModule: null,
      orderModule: null
    };
    this.businessLinkApi = new BusinessLink();
    this.businessPartnerApi = new BusinessPartner();
    this.bpModel = new BusinessPartnerModel({});
    this.statusModal = null;
    this.componentLoader = new System.ComponentLoader({ onLoadingStarted: NOOP, onLoadingFinished: NOOP });
    this.CustomerInchannelDetails = context.loadComponent({
      serviceName: 'einvoice-send',
      moduleName: 'business-link-connection-details',
      jsFileName: 'business-link-connection-details'
    });
  }

  componentWillMount() {
    this.context.i18n.register('BusinessLink', locales);
  };

  async componentDidMount() {
    try {
      const businessPartner = await this.businessPartnerApi.find(this.props.businessPartnerId);

      if (this.noType(businessPartner)) {
        return await this.setState({ businessPartner, loading: false });
      }

      this.bpModel = new BusinessPartnerModel(businessPartner);
      const bpType = stringHelper.capitalize(this.bpModel.type);
      const bpOthertype = this.bpModel.otherType;
      Promise.all([
        this.businessLinkApi[`allFor${bpType}Id`](businessPartner.id, { include: bpOthertype }),
        this.componentLoader.fetchScript({ url: '/einvoice-send/static/components/business-link.js' }),
        this.componentLoader.fetchScript({ url: '/sales-order/static/components/order-business-link.js' })
      ]).then(async ([businessLinks, scripts]) => {
        const eInvoiceSendModule = window["business-link"];
        const orderModule = window["order-business-link"];

        const connections = await businessLinks.reduce(async (previousPromise, bl) => {
          let acc = await previousPromise;

          return acc.concat(await Promise.all(bl.connections.map(async conn => {
            conn.config = JSON.parse(conn.config);
            conn = {
              ...conn,
              supplierId: bl.supplierId,
              customerId: bl.customerId,
              [bpOthertype]: bl[bpOthertype]
            };
            conn.canConnect = await this.canConnect(conn, eInvoiceSendModule, orderModule);
            return conn;
          })));
        }, []);

        this.setState({ connections, businessPartner, eInvoiceSendModule, orderModule, loading: false });
      });
    } catch(error) {
      console.log(error);
    }
  }

  componentWillReceiveProps(nextProps, nextContext){
    if(nextContext.i18n) nextContext.i18n.register('BusinessLink', locales);
  }

  notify(message, type) {
    if (this.context.showNotification) this.context.showNotification(message, type);
  }

  noType(businessPartner) {
    return !businessPartner.isCustomer && !businessPartner.isSupplier;
  }

  setup(connection) {
    let url;

    switch(connection.type)
    {
      case CONNECTION.INVOICE:
        url = this.state.eInvoiceSendModule.getSetupURL(connection);
        break;
      case CONNECTION.ORDER:
        url = this.state.orderModule.getSetupURL(connection);;
    }

    this.context.router.push(url);
  }

  async canConnect(conn, eInvoiceSendModule, orderModule) {
    if (conn.type === CONNECTION.INVOICE)
      return await eInvoiceSendModule.canConnect(conn.supplierId, conn.customerId, conn);

    if (conn.type === CONNECTION.ORDER)
      return await orderModule.canConnect(conn.supplierId, conn.customerId, conn);

    return await { connect: true, onCost: false };
  }

  connect(connection) {
    const bpType = this.bpModel.type;
    connection.status =  STATUS.CONNECTED;
    this.businessLinkApi[`update${stringHelper.capitalize(bpType)}Connection`](connection[`${bpType}Id`], connection.id, connection).
      then(conn => this.updateConnectionsState(conn)).
      catch(() => this.notify(this.context.i18n.getMessage(`BusinessLink.Connections.Message.Error.${connection.status}`), 'error'));
  }

  reject(connection) {
    const bpType = this.bpModel.type;
    connection.status = STATUS.REJECTED;
    this.businessLinkApi[`update${stringHelper.capitalize(bpType)}Connection`](connection[`${bpType}Id`], connection.id, connection).
      then(conn => this.updateConnectionsState(conn)).
      catch(() => this.notify(this.context.i18n.getMessage(`BusinessLink.Connections.Message.Error.${connection.status}`), 'error'));
  }

  async updateConnectionsState(connection) {
    const { connections } = this.state;
    const bpOthertype = this.bpModel.otherType;

    const index = connections.findIndex(conn => conn.id === connection.id);
    connection.supplierId = connections[index].supplierId;
    connection.customerId = connections[index].customerId;
    connection[bpOthertype] = connections[index][bpOthertype];
    connection.config = JSON.parse(connection.config);
    connection.canConnect = await this.canConnect(connection, this.state.eInvoiceSendModule, this.state.orderModule);
    connections[index] = connection;

    this.setState({ connections: connections });

    this.notify(this.context.i18n.getMessage(`BusinessLink.Connections.Message.Success.${connection.status}`), 'info');
  }

  handleShowStatus(connection) {
    this.setState({ currentConnection: connection });

    const title = this.context.i18n.getMessage('BusinessLink.Connections.Status.title');
    const buttons = { 'close': this.context.i18n.getMessage('BusinessPartner.Buttons.close') };
    const onButtonClick = () => this.statusModal.hide();
    this.statusModal.show(title, undefined, onButtonClick, buttons);
  }

  renderStatusModal() {
    if (!this.state.currentConnection) return null;

    const connection = this.state.currentConnection;
    let supplier;
    let customer;

    if (this.bpModel.type === BusinessPartnerModel.SUPPLIER) {
      supplier = this.state.businessPartner;
      customer = connection.customer;
    } else {
      customer = this.state.businessPartner;
      supplier = connection.supplier;
    }

    return <this.CustomerInchannelDetails
             supplier={supplier}
             customer={customer}
             businessLinkConnection={connection}
           />
  }

  renderStatus(connection) {
    const statusText = this.context.i18n.getMessage(`BusinessLink.Connections.Status.${connection.status}`);

    if (connection.type !== 'invoice') return statusText;

    return (
      <button className='btn-link' onClick={this.handleShowStatus.bind(this, connection)} >{statusText} <i className="fa fa-info-circle fa-fw" /></button>
    );
  }

  renderSetup(connection) {
    if (this.bpModel.type === BusinessPartnerModel.CUSTOMER) return null;

    if (connection.type === CONNECTION.CATALOG) return null;

    return (
      <button className="btn btn-sm btn-default" onClick={() => this.setup(connection)}>
        {this.context.i18n.getMessage(`BusinessLink.Connections.Actions.setup`)}
      </button>
    );
  }

  renderConnect(connection) {
    if (connection.status === STATUS.CONNECTED) return null;

    const result = connection.canConnect;

    if (!result.connect) return null;

    if (result.onCost) return null;

    return (
      <button className="btn btn-sm btn-default" onClick={() => this.connect(connection)}>
        {this.context.i18n.getMessage(`BusinessLink.Connections.Actions.connect`)}
      </button>
    );
  }

  renderReject(connection) {
    if (connection.status === STATUS.REJECTED) return null;

    return (
      <button className="btn btn-sm btn-default" onClick={() => this.reject(connection)}>
        {this.context.i18n.getMessage(`BusinessLink.Connections.Actions.reject`)}
      </button>
    );
  }

  render() {


    const { i18n } = this.context;
    const otherBusinessPartnerType = this.bpModel.otherType;

    const columns = [
      {
        Header: i18n.getMessage('BusinessLink.Connections.Tenant.name'),
        accessor: otherBusinessPartnerType,
        Cell: row => (row.value ? row.value.name : '-')
      },
      {
        Header: i18n.getMessage('BusinessLink.Connections.Tenant.id'),
        accessor: `${otherBusinessPartnerType}Id`
      },
      {
        Header: i18n.getMessage(`BusinessLink.Connections.Type.title`),
        id: 'type',
        accessor: element => i18n.getMessage(`BusinessLink.Connections.Type.${element.type}`)
      },
      {
        Header: i18n.getMessage('BusinessLink.Connections.Status.title'),
        id: 'status',
        accessor: element => element,
        Cell: row => this.renderStatus(row.value)
      },
      {
        Header: i18n.getMessage('BusinessLink.Connections.Actions.title'),
        id: 'actions',
        accessor: element => element,
        Cell: row => {
          return (
            <div className="text-right">
              {this.renderSetup(row.value)}
              {this.renderConnect(row.value)}
              {this.renderReject(row.value)}
            </div>
          );
        }
      },
    ];

    return (
      <div>
        <Table
          data={this.state.connections}
          columns={columns}
          loading={this.state.loading}
          className="table text-center"
          noDataText={
            `${i18n.getMessage('BusinessPartner.Table.noDataText')} ${this.noType(this.state.businessPartner) ? i18n.getMessage('BusinessPartner.Error.noType') : ''}`
          }
        />
        <Components.ModalDialog ref={node => this.statusModal = node} size='large'>
          {this.renderStatusModal()}
        </Components.ModalDialog>
      </div>
    );
  }
};
