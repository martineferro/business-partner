import React, { Component, PropTypes } from 'react';
import locales from '../../../i18n';
import Table from '../../Table.react';
import { Access } from '../../../api';
import ActionButton from '../../ActionButton.react';
import dateHelper from '../../../utils/dateHelper';
import AccessRequest from '../../../models/BusinessPartnerAccessRequest';

export default class Approval extends Component {

  constructor(props) {
    super(props);
    this.state = { accessRequests: [], loading: true };
    this.accessApi = new Access();
  }

  static propTypes = {
    businessPartnerId: PropTypes.string.isRequired
  };

  static contextTypes = {
    i18n : React.PropTypes.object.isRequired,
    showNotification: React.PropTypes.func
  };

  componentWillMount() {
    this.context.i18n.register('BusinessPartner', locales);
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if(nextContext.i18n) nextContext.i18n.register('BusinessPartner', locales);
  }

  componentDidMount() {
    this.accessApi.all(this.props.businessPartnerId).then(accessRequests => {
      this.setState({ accessRequests: accessRequests, loading: false });
    });
  }

  updateAccessRequests = (access) => {
    let accessRequests = this.state.accessRequests;
    const index = accessRequests.findIndex(acc => acc.id === access.id);

    if (index === -1) throw new Error(`Not found accessRequest for id=${access.id}`);
    accessRequests[index].status = access.status;

    this.setState({ accessRequests: accessRequests });
  };

  approveOnClick = (access) => {
    const message = this.context.i18n.getMessage('BusinessPartner.AccessApproval.Confirmation.approve');
    if (!confirm(message)) return;

    this.accessApi.approve(access.id, access.userId).then(bpAccess => {
      this.updateAccessRequests(bpAccess);

      const info = this.context.i18n.getMessage('BusinessPartner.AccessApproval.Messages.approved');
      if(this.context.showNotification) this.context.showNotification(info, 'info');
    });
  };

  rejectOnClick = (access) => {
    const message = this.context.i18n.getMessage('BusinessPartner.AccessApproval.Confirmation.reject');
    if (!confirm(message)) return;

    this.accessApi.reject(access.id, access.userId).then(bpAccess => {
      this.updateAccessRequests(bpAccess);

      const info = this.context.i18n.getMessage('BusinessPartner.AccessApproval.Messages.rejected');
      if(this.context.showNotification) this.context.showNotification(info, 'info');
    });
  };

  renderActions(access) {
    if (access.status !== AccessRequest.REQUESTED)
      return this.context.i18n.getMessage(`BusinessPartner.AccessApproval.Status.${access.status}`);

    return (
      <div className='text-right'>
        {['approve', 'reject'].map(status => {
          return <ActionButton
                    key={status}
                    action={status}
                    onClick={this[`${status}OnClick`].bind(this, access)}
                    label={this.context.i18n.getMessage(`BusinessPartner.Button.${status}`)}
                    isSmall={true}
                    showIcon={true}
                  />
        })}
      </div>
    );
  }

  renderTable(data) {

    const columns = [
      {
        Header: this.context.i18n.getMessage('BusinessPartner.AccessApproval.Label.firstName'),
        accessor: 'firstName',
        style: { 'white-space': 'unset' }
      },
      {
        Header: this.context.i18n.getMessage('BusinessPartner.AccessApproval.Label.lastName'),
        accessor: 'lastName',
        style: { 'white-space': 'unset' }
      },
      {
        Header: this.context.i18n.getMessage('BusinessPartner.AccessApproval.Label.email'),
        accessor: 'email',
        style: { 'white-space': 'unset' }
      },
      {
        Header: this.context.i18n.getMessage('BusinessPartner.AccessApproval.Label.date'),
        id: 'date',
        accessor: element => dateHelper.format(element.date, this.context.i18n.locale)
      },
      {
        Header: this.context.i18n.getMessage('BusinessPartner.AccessApproval.Label.comment'),
        accessor: 'comment',
        style: { 'white-space': 'unset' }
      },
      {
        Header: this.context.i18n.getMessage('BusinessPartner.AccessApproval.Label.status'),
        accessor: element => ({ id: element.id, userId: element.userId, status: element.status }),
        id: 'actions',
        Cell: row => this.renderActions(row.value)
      }];

    return <Table data={data} columns={columns} defaultPageSize={5} loading={this.state.loading} />
  }

  render() {
    return (
      <div>
        <h4 className="tab-description">{this.context.i18n.getMessage('BusinessPartner.Heading.accessApproval')}</h4>
        <div className='table-responsive'>{this.renderTable(this.state.accessRequests)}</div>
      </div>
    );
  }
}
