import React, { PropTypes } from 'react';
import locales from '../../../i18n';
import Table from '../../Table.react';
import { BusinessPartner } from '../../../api';
import { Components } from '@opuscapita/service-base-ui';
import CountryView from '../../CountryView.react';
import ActionButton from '../../ActionButton.react';
import Public from '../Public';
require('./Directory.css');
import BpCapability from '../../../models/BusinessPartnerCapability';

export default class Directory extends Components.ContextComponent  {
  static propTypes = {
    businessPartnerType: PropTypes.oneOf(['supplier', 'customer']).isRequired
  };

  static defaultProps = { businessPartnerType: 'supplier' };

  constructor(props) {
    super(props);
    this.state = { searchWord: '', capability: '', businessPartnerId: null, data: [] };
    this.api = new BusinessPartner();
    this.publicModal = null;
    this.type = this.props.businessPartnerType;
  }

  componentWillMount(){
    this.context.i18n.register('BusinessPartner', locales);
  }

  componentWillReceiveProps(nextProps, nextContext){
    if(nextContext.i18n) nextContext.i18n.register('BusinessPartner', locales);
  }

  search() {
    let queryParam = { search: this.state.searchWord, capabilities: this.state.capability };
    if (this.type === 'supplier') queryParam.isSupplier = true;
    if (this.type === 'customer') queryParam.isCustomer = true;
    this.api.all(queryParam).then(data => this.setState({ data: data }));
  }

  handleChange(fieldName, event) {
    this.setState({ [fieldName]: event.target.value });
  }

  handleShowModal(businessPartnerId) {
    this.setState({ businessPartnerId: businessPartnerId });

    const title = this.context.i18n.getMessage('BusinessPartner.Heading.companyInformation');
    const buttons = { 'close': this.context.i18n.getMessage('BusinessPartner.Button.close') };
    const onButtonClick = () => this.publicModal.hide();
    this.publicModal.show(title, undefined, onButtonClick, buttons);
  }

  renderSearchBox() {
    return (<div className="form-group search-box">
      <div className='row'>
        <label className="control-label col-xs-10">{this.context.i18n.getMessage('BusinessPartner.Label.searchInput')}</label>
        <label className="control-label col-xs-2">{this.context.i18n.getMessage('BusinessPartner.Label.capability')}</label>
      </div>
      <div className='row'>
        <div className='col-xs-10'>
          <input value={this.state.searchWord} onChange={this.handleChange.bind(this, 'searchWord')} className="form-control"/>
        </div>
        <div className='col-xs-2'>
          <select value={this.state.capability} onChange={this.handleChange.bind(this, 'capability')} className="form-control" >
            <option key='1' value=''></option>
            <option key='2' value={BpCapability.INVOICE_SEND}>{this.context.i18n.getMessage('BusinessPartner.Capabilities.Type.eInvoice-send')}</option>
            <option key='3' value={BpCapability.ORDER}>{this.context.i18n.getMessage('BusinessPartner.Capabilities.Type.order')}</option>
          </select>
        </div>
      </div>
      <div className="text-right form-submit" style={{ marginTop: '16px' }}>
        <ActionButton
          id="business-partner-editor__search"
          style='primary'
          onClick={this.search.bind(this)}
          label={this.context.i18n.getMessage('BusinessPartner.Button.search')}
        />
      </div>
    </div>)
  }

  renderTable(data) {

    const columns = [
      {
        Header: this.context.i18n.getMessage('BusinessPartner.Label.name'),
        id: 'name',
        accessor: element => ({ name: element.name, id: element.id }),
        Cell: (row) => (<ActionButton style='link' label={row.value.name} onClick={this.handleShowModal.bind(this, row.value.id)} />),
        style: { 'white-space': 'unset' }
      },
      {
        Header: this.context.i18n.getMessage('BusinessPartner.Label.cityOfRegistration'),
        accessor: 'cityOfRegistration',
        style: { 'white-space': 'unset' }
      },
      {
        Header: this.context.i18n.getMessage('BusinessPartner.Label.countryOfRegistration'),
        accessor: 'countryOfRegistration',
        Cell: (row) => <CountryView countryId={row.value}/>,
        style: { 'white-space': 'unset' }
      },
      {
        Header: this.context.i18n.getMessage('BusinessPartner.Label.commercialRegisterNo'),
        accessor: 'commercialRegisterNo',
        style: { 'white-space': 'unset' }
      },
      {
        Header: this.context.i18n.getMessage('BusinessPartner.Title.companyIdentifiers'),
        accessor: element => ({ vatIdentificationNo: element.vatIdentificationNo, globalLocationNo: element.globalLocationNo, dunsNo: element.dunsNo }),
        id: 'businessPartnerentifiers',
        Cell: row => {
          const keys = Object.keys(row.value);
          return (
            <div>
              {Object.values(row.value).map((identifier, index) => {
                if (!identifier) return null;

                return <div key={index}>
                  <div><strong>{this.context.i18n.getMessage(`BusinessPartner.Label.${keys[index]}`)}</strong></div>
                  <div>{identifier}</div>
                </div>
              })}
            </div>
          );
        },
        style: { 'white-space': 'unset' }
      },
      {
        Header: this.context.i18n.getMessage('BusinessPartner.Capabilities.name'),
        accessor: element => {
          if (!element.capabilities) return null;

          return element.capabilities.map(cap => this.context.i18n.getMessage(`BusinessPartner.Capabilities.Type.${cap}`)).join(', ');
        },
        id: 'capabilities',
        style: { 'white-space': 'unset' }
      }];

    return <Table data={data} columns={columns} />;
  }

  render() {
    return (<div>
      { this.renderSearchBox() }
      <div className="table-responsive">
        { this.renderTable(this.state.data) }
      </div>
      <Components.ModalDialog ref={node => this.publicModal = node} size='large'>
          <Public businessPartnerId={this.state.businessPartnerId}/>
      </Components.ModalDialog>
    </div>)
  }
}
