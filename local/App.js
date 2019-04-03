import React from 'react';
import { Route } from 'react-router';
import { Containers } from '@opuscapita/service-base-ui';

const username = 'john.doe@ncc.com';
const userRoles = ['supplier-admin', 'user'];

const supplierId = 'hard001';
const customerId = 'ncc';

class Page extends React.Component
{
  constructor(props) {
    super(props);
  }

  handleClick(tab) {
    this.setState({ activeTab: tab });
  }

  render() {
    return (
      <div>
        Coming Soon
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
