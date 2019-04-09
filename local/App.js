import React from 'react';
import { Route } from 'react-router';
import { Containers } from '@opuscapita/service-base-ui';
import BusinessPartnerEditor from '../src/client/components/BusinessPartner/Editor';
import BusinessPartnerCreator from '../src/client/components/BusinessPartner/Creator';
import BusinessPartnerRegistrator from '../src/client/components/BusinessPartner/Registrator';

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

let registrator = <BusinessPartnerRegistrator key='register' businessPartner={onboardingSupplier} />;

var tabData = [
  { name: 'Editor', isActive: true },
  { name: 'Creator', isActive: false },
  { name: 'Registrator', isActive: false }
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
