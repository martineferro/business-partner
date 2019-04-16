import { BusinessLink } from '../../../api';
import React, { PropTypes } from 'react';
import { Components } from '@opuscapita/service-base-ui';
import locales from '../../../i18n';
import Table from '../../Table.react';

export default class List extends Components.ContextComponent {
  constructor(props) {
    super(props);

    this.state = { businessLinks: [], loading: true };

    this.businessLinkApi = new BusinessLink();
  }

  static propTypes = {
    onEdit: PropTypes.func.isRequired
  };

  componentWillMount() {
    this.context.i18n.register('BusinessLink', locales);
  }

  async componentDidMount() {
    try {
      const businessLinks = await this.businessLinkApi.all({ include: 'supplier,customer' });

      this.setState({ businessLinks, loading: false });
    } catch(error) {
      this.setState({ loading: false });
      this.notify(this.context.i18n.getMessage('BusinessLink.Connections.Message.Error.general'), 'error');
    }
  }

  componentWillReceiveProps(nextProps, nextContext){
    if(nextContext.i18n) nextContext.i18n.register('BusinessLink', locales);
  }

  onEditClick(businessLinkId) {
    this.props.onEdit(businessLinkId);
  }

  notify(message, type) {
    if (this.context.showNotification) this.context.showNotification(message, type);
  }

  render() {
    const { i18n } = this.context;

    const columns = [
      {
        Header: i18n.getMessage('BusinessLink.Label.customerId'),
        accessor: 'customer',
        Cell: row => (row.value ? row.value.name : '-'),
        style: { 'white-space': 'unset' }
      },
      {
        Header: i18n.getMessage('BusinessLink.Label.supplierId'),
        accessor: 'supplier',
        Cell: row => (row.value ? row.value.name : '-'),
        style: { 'white-space': 'unset' }
      },
      {
        Header: i18n.getMessage('BusinessLink.Label.customerSupplierId'),
        accessor: 'customerSupplierId'
      },
      {
        Header: i18n.getMessage('BusinessLink.Label.connections'),
        accessor: 'connections',
        Cell: row => {
          return (
            <ul>
              {row.value.map((connection, index) => {
                const type = i18n.getMessage(`BusinessLink.Connections.Type.${connection.type}`);
                const status = i18n.getMessage(`BusinessLink.Connections.Status.${connection.status}`);
                return <li key={index}>{`${type} (${status})`}</li>
              })}
            </ul>
          );
        }
      },
      {
        Header: i18n.getMessage('BusinessLink.Connections.Actions.title'),
        accessor: 'id',
        Cell: row => {
          return (
            <div className="text-right">
              <button className="btn btn-sm btn-default" onClick={() => this.onEditClick(row.value)}>
                <span className="glyphicon glyphicon-edit"></span>
                &nbsp;{i18n.getMessage(`BusinessPartner.Button.edit`)}
              </button>
            </div>
          );
        }
      }
    ];

    return (
      <div>
        <h1 className="tab-description">{i18n.getMessage('BusinessLink.Message.Heading.list')}</h1>
        <Table
          data={this.state.businessLinks}
          columns={columns}
          loading={this.state.loading}
          className="-striped"
        />
      </div>
    );
  }
};
