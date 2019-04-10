import React, { PropTypes, Component } from 'react';
import { BusinessPartner } from '../../../api';
import OrgChart from 'react-orgchart';
import 'react-orgchart/index.css';
import './Organization.css';

const MyNodeComponent = ({node}) => {
  const activeClass = node.activeClass ? 'active' : '';
  return (
    <div className={`initechNode ${activeClass}`} onClick={() => null }>{ node.name }</div>
  );
};

export default class Organization extends Component {
  constructor(props) {
    super(props);
    this.state = { org: {} };
    this.api = new BusinessPartner();
  }

  static propTypes = {
    businessPartnerId: PropTypes.string.isRequired
  };

  componentDidMount() {
    this.api.organization(this.props.businessPartnerId).then(businessPartners => {
      this.setState({ org: this.transformData(businessPartners) })
    });
  }

  transformData(businessPartners) {
    if (businessPartners.length === 0) return {};

    const businessPartnersById = businessPartners.reduce((acc, businessPartner) => {
      acc[businessPartner.id] = businessPartner;
      acc[businessPartner.id].activeClass = businessPartner.id === this.props.businessPartnerId;
      return acc;
    }, {});

    businessPartners.forEach(businessPartner => {
      const parentId = businessPartner.parentId;
      if (parentId) {
        if (!businessPartnersById[parentId].children) businessPartnersById[parentId].children = [];

        businessPartnersById[parentId].children.push(businessPartner);
      }
    });

    return businessPartners[0];
  }

  render() {
    if (Object.keys(this.state.org).length === 0) return null;

    return <OrgChart tree={this.state.org} NodeComponent={MyNodeComponent} />;
  }
};
