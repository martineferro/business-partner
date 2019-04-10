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

let organization = <Organization key='org' businessPartnerId={supplierId} />

let profileStrength = <ProfileStrength key='org' businessPartnerId={supplierId} />

var tabData = [
  { name: 'Editor', isActive: true },
  { name: 'Creator', isActive: false },
  { name: 'Registrator', isActive: false },
  { name: 'List', isActive: false },
  { name: 'Directory', isActive: false },
  { name: 'Visibility', isActive: false },
  { name: 'Organization', isActive: false },
  { name: 'Profile Str.', isActive: false }
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
