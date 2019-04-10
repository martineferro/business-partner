import React, { Component, PropTypes } from 'react';
import Gauge from 'react-svg-gauge';
import hexColourCalculator from './hexColourCalculator';
import { BusinessPartner } from '../../../api';

class ProfileStrength extends Component {
  static propTypes = {
    businessPartnerId: PropTypes.string.isRequired
  };

  constructor() {
    super();
    this.state = { value: 0 };
    this.api = new BusinessPartner();
  }

  componentDidMount() {
    this.api.profileStrength(this.props.businessPartnerId).
      then(value => this.setState({ value: value })).catch(errors => null);
  }

  render() {
    const colorHex = hexColourCalculator.colourFor(this.state.value);

    return (
      <div>
        <Gauge value={this.state.value} width={200} height={160} color={colorHex} label="" />
      </div>
    );
  }
}

export default ProfileStrength;
