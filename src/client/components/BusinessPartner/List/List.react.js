import React, { PropTypes, Component } from 'react';
import locales from '../../../i18n';
import Table from '../../Table.react';
import { BusinessPartner } from '../../../api';
import ActionButton from '../../ActionButton.react';
import AttributeValueEditorRow from '../../AttributeValueEditorRow.react.js';

export default class List extends Component  {
  constructor(props) {
    super(props);
    this.state = {
      businessPartners: [],
      businessPartnerName: '',
      businessPartnerId: '',
      type: props.businessPartnerType || '',
      loading: true
    };
    this.api = new BusinessPartner();
  }

   static contextTypes = {
    i18n : PropTypes.object.isRequired,
    showNotification: PropTypes.func
  };

  static propTypes = {
    onEdit: PropTypes.func.isRequired,
    onCreateUser: PropTypes.func.isRequired,
    businessPartnerType: PropTypes.oneOf(['supplier', 'customer'])
  };

  componentWillMount(){
    this.context.i18n.register('BusinessPartner', locales);
  }

  componentWillReceiveProps(nextProps, nextContext){
    if(nextContext.i18n) nextContext.i18n.register('BusinessPartner', locales);
    this.search();
  }

  componentDidMount() {
    this.search();
  }

  async search() {
    await this.setState({ loading: true })
    let query = {};
    if (this.state.businessPartnerName) query.name = this.state.businessPartnerName;
    if (this.state.businessPartnerId) query.id = this.state.businessPartnerId;
    if (this.state.type === 'supplier') query.isSupplier = true;
    if (this.state.type === 'customer') query.isCustomer = true;
    this.api.all(query).then(data => this.setState({ businessPartners: data, loading: false }));
  }

  async handleReset(event) {
    event.preventDefault();
    await this.setState({ businessPartnerName: '', businessPartnerId: '', type: this.props.businessPartnerType || '' });
    this.search();
  }

  onSearchChange(fieldValue, event) {
    this.setState({ [fieldValue]: event.target.value });
  }

  editOnClick(businessPartnerId) {
    this.props.onEdit(businessPartnerId);
  }

  createUserOnClick(businessPartnerId) {
    this.props.onCreateUser(businessPartnerId, this.props.businessPartnerType);
  }

  renderField(attrs) {
    const { field, fieldName, label } = attrs;
    const { i18n } = this.context;

    let component = attrs.component ||
      <input value={this.state[field]} onChange={this.onSearchChange.bind(this, field)} className="form-control"/>;

    return (
      <AttributeValueEditorRow labelText={label || i18n.getMessage(`BusinessPartner.Label.${fieldName}`)}>
        {component}
      </AttributeValueEditorRow>
    );
  }

  renderActions(businessPartnerId) {
    return (
      <div className='text-right'>
        {['edit', 'createUser'].map(action => {
          return <ActionButton
                    key={action}
                    action={action}
                    onClick={this[`${action}OnClick`].bind(this, businessPartnerId)}
                    label={this.context.i18n.getMessage(`BusinessPartner.Button.${action}`)}
                    isSmall={true}
                    showIcon={true}
                  />
        })}
      </div>
    );
  }

  renderCheck() {
    return <i className='fa fa-check' />;
  }

  renderTable(data) {
    const columns = [
      {
        Header: this.context.i18n.getMessage('BusinessPartner.Label.isSupplier'),
        accessor: 'isSupplier',
        Cell: row => {
          if (!row.value) return null;

          return this.renderCheck();
        },
        maxWidth: 120
      },
      {
        Header: this.context.i18n.getMessage('BusinessPartner.Label.isCustomer'),
        accessor: 'isCustomer',
        Cell: row => {
          if (!row.value) return null;

          return this.renderCheck();
        },
        maxWidth: 120
      },
      {
        Header: this.context.i18n.getMessage('BusinessPartner.Label.name'),
        accessor: 'name',
      },
      {
        Header: this.context.i18n.getMessage('BusinessPartner.Label.id'),
        accessor: 'id'
      },
      {
        Header: '',
        accessor: 'id',
        id: 'actions',
        Cell: row => this.renderActions(row.value)
      }];

    return <Table data={data} columns={this.props.businessPartnerType ? columns.slice(2) : columns} loading={this.state.loading} />;
  }

  render() {
    return (
      <div>
        <h1 className="tab-description">{this.context.i18n.getMessage('BusinessPartner.Heading.list')}</h1>
        <div className="form-horizontal search-list">
          <div className='row'>
            <div className='col-sm-4'>
              { this.renderField({ field: 'businessPartnerName', fieldName: 'name' }) }
            </div>
            <div className='col-sm-4'>
              { this.renderField({ field: 'businessPartnerId', fieldName: 'id' }) }
            </div>
            <div className='col-sm-4'>
              {!this.props.businessPartnerType ? this.renderField({
                field: 'businessPartnerId',
                label: this.context.i18n.getMessage('BusinessPartner.Title.type'),
                component: (
                  <select value={this.state.type} onChange={this.onSearchChange.bind(this, 'type')} className="form-control" >
                    <option key='1' value=''></option>
                    <option key='2' value='supplier'>{this.context.i18n.getMessage('BusinessPartner.Label.isSupplier')}</option>
                    <option key='3' value='customer'>{this.context.i18n.getMessage('BusinessPartner.Label.isCustomer')}</option>
                  </select>
                )
              }) : null }
            </div>
          </div>
          <div className="text-right form-submit" style={{ marginBottom: '30px' }}>
            <ActionButton
              style='link'
              onClick={this.handleReset.bind(this)}
              label={this.context.i18n.getMessage('BusinessPartner.Button.reset')}
            />
            <ActionButton
              style='primary'
              onClick={this.search.bind(this)}
              label={this.context.i18n.getMessage('BusinessPartner.Button.search')}
            />
          </div>
        </div>
        <div className='table-responsive'>{this.renderTable(this.state.businessPartners)}</div>
      </div>
    );
  }
}
