import React, { Component } from 'react';
import { Country } from '../api';

export default class CountryView extends Component {

  static propTypes = {
    countryId: React.PropTypes.string.isRequired
  };

  static contextTypes = {
    i18n: React.PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);

    this.state = { country: null };
    this.countryApi = new Country();
  }

  componentDidMount() {
    this.loadCountry(this.props.countryId, this.context.i18n.locale);
  }

  componentWillReceiveProps(newProps, newContext) {
    const localeNotEqual = this.context.i18n.locale !== newContext.i18n.locale;
    if (localeNotEqual) this.loadCountry(newProps.countryId, newContext.i18n.locale);
  }

  loadCountry = (countryId, locale) => {
    return this.countryApi.getCountry(countryId, locale).then(country => {
      this.setState({ country: country });
    }).
    catch(errors => {
      console.log(`Error getting country for ID ${countryId}`);
      this.setState({ country: countryId });
    });
  };

  render() {
    return (<div>{this.state.country}</div>);
  }
}
