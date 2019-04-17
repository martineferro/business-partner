import React from 'react';
import { Route } from 'react-router';
import { Containers } from '@opuscapita/service-base-ui';
import BusinessPartnerEditor from '../src/client/components/BusinessPartner/Editor';
import BusinessPartnerCreator from '../src/client/components/BusinessPartner/Creator';
import BusinessPartnerRegistrator from '../src/client/components/BusinessPartner/Registrator';
import BusinessPartnerList from '../src/client/components/BusinessPartner/List';
import BusinessPartnerDirectory from '../src/client/components/BusinessPartner/Directory';
import VisibilityPreference from '../src/client/components/BusinessPartner/VisibilityPreference';
import Organization from '../src/client/components/BusinessPartner/Organization';
import ProfileStrength from '../src/client/components/BusinessPartner/ProfileStrength';
import Approval from '../src/client/components/BusinessPartner/Approval';
import Address from '../src/client/components/BusinessPartner/Address';
import BankAccount from '../src/client/components/BusinessPartner/BankAccount';
import Contact from '../src/client/components/BusinessPartner/Contact';
import ConnectionsWidget from '../src/client/components/BusinessLink/ConnectionsWidget';
import ConnectionsOverview from '../src/client/components/BusinessLink/ConnectionsOverview';
import Connections from '../src/client/components/BusinessLink/Connections';
import BusinessLinkList from '../src/client/components/BusinessLink/List';

const username = 'john.doe@ncc.com';
const userRoles = ['supplier-admin', 'user'];

const supplierId = 'hard001';
const customerId = 'ncc';

const onboardingSupplier = {
  supplierName: 'E-Farm AG',
  cityOfRegistration: 'Hamburg',
  countryOfRegistration: 'DE',
  taxIdentificationNo: 'T-534324',
  dunsNo: '123450986',
  commercialRegisterNo: 'MI342323'
};

let editor = <BusinessPartnerEditor key='editor' businessPartnerId={supplierId} />;
let creator = <BusinessPartnerCreator key='creator' />;
let registrator = <BusinessPartnerRegistrator key='reg' businessPartner={onboardingSupplier} />;
let list = <BusinessPartnerList onEdit={id => console.log(id)} onCreateUser={id => console.log(id)} />;
let directory = <BusinessPartnerDirectory key='directory' />;
let visibility = <VisibilityPreference key='visibility' businessPartnerId={supplierId} />;
let organization = <Organization key='org' businessPartnerId={supplierId} />;
let profileStrength = <ProfileStrength key='org' businessPartnerId={supplierId} />;
let approval = <Approval key='approval' businessPartnerId={supplierId} />;
let address = <Address key='address' businessPartnerId={supplierId} />;
let bankAccount = <BankAccount key='bank-account' businessPartnerId={supplierId} />;
let contact = <Contact key='contact' businessPartnerId={supplierId} />;

let blcWidget = <ConnectionsWidget customerId={customerId} />;
let blcOverview = <ConnectionsOverview
                    key='overview'
                    supplierId={supplierId}
                    onInvoiceClick={() => console.log('invoice clicked')}
                    onPurchaseOrderClick={() => console.log('purchase order clicked')}
                    onCatalogClick={() => console.log('catalog clicked')}
                  />
let blConnections = <Connections businessPartnerId={supplierId} />
let businessLinks = <BusinessLinkList onEdit={id => console.log(id)} />

var tabData = [
  { name: 'Editor', isActive: true },
  { name: 'Creator', isActive: false },
  { name: 'Registrator', isActive: false },
  { name: 'List', isActive: false },
  { name: 'Directory', isActive: false },
  { name: 'Visibility', isActive: false },
  { name: 'Organization', isActive: false },
  { name: 'Profile Str.', isActive: false },
  { name: 'Approval', isActive: false },
  { name: 'Address', isActive: false },
  { name: 'Bank Account', isActive: false },
  { name: 'Contact', isActive: false },
  { name: 'BLC Widget', isActive: false },
  { name: 'BLC Overview', isActive: false },
  { name: 'BL Connections', isActive: false },
  { name: 'Business Links', isActive: false }
];

class Tabs extends React.Component
{
  render() {
    return (
      <ul className="nav nav-tabs">
        {tabData.map(tab => {
          return (
            <Tab key={tab.name} data={tab} isActive={this.props.activeTab === tab} handleClick={this.props.changeTab.bind(this,tab)} />
          );
        })}
      </ul>
    );
  }
};

class Tab extends React.Component
{
  render() {
    return (
      <li onClick={this.props.handleClick} className={this.props.isActive ? "active" : null}>
        <a href="#">{this.props.data.name}</a>
      </li>
    );
  }
};

class Content extends React.Component
{
  render() {
    return (
      <div>
        {this.props.activeTab.name === 'Editor' ? editor : null}
        {this.props.activeTab.name === 'Creator' ? creator : null}
        {this.props.activeTab.name === 'Registrator' ? registrator : null}
        {this.props.activeTab.name === 'List' ? list : null}
        {this.props.activeTab.name === 'Directory' ? directory : null}
        {this.props.activeTab.name === 'Visibility' ? visibility : null}
        {this.props.activeTab.name === 'Organization' ? organization : null}
        {this.props.activeTab.name === 'Profile Str.' ? profileStrength : null}
        {this.props.activeTab.name === 'Approval' ? approval : null}
        {this.props.activeTab.name === 'Address' ? address : null}
        {this.props.activeTab.name === 'Bank Account' ? bankAccount : null}
        {this.props.activeTab.name === 'Contact' ? contact : null}
        {this.props.activeTab.name === 'BLC Widget' ? blcWidget : null}
        {this.props.activeTab.name === 'BLC Overview' ? blcOverview : null}
        {this.props.activeTab.name === 'BL Connections' ? blConnections : null}
        {this.props.activeTab.name === 'Business Links' ? businessLinks : null}
      </div>
    );
  }
};

class Page extends React.Component
{
  constructor(props) {
    super(props);
    this.state = { activeTab: tabData[0] };
  }

  handleClick(tab) {
    this.setState({ activeTab: tab });
  }

  render() {
    return (
      <div>
        <Tabs activeTab={this.state.activeTab} changeTab={this.handleClick.bind(this)} />
        <Content activeTab={this.state.activeTab} />
      </div>
    );
  }
};

class App extends React.Component
{
  render()
  {
    return(
      <Containers.ServiceLayout serviceName='business-partner'>
        <Route exact path='/' component={() => <Page /> }/>
      </Containers.ServiceLayout>
    );
  }
}

export default App;
