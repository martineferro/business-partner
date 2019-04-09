import React, { Component, PropTypes } from 'react';
import { BusinessPartner } from '../../../api';
import CountryView from '../../CountryView.react';
import i18nMessages from '../../../i18n';
import AddressComponent from './AddressPublic.react';
import ContactComponent from './ContactPublic.react';
import BankAccountComponent from './BankAccountPublic.react';
require('./Public.css');

export default class Public extends Component {

  static propTypes = {
    businessPartnerId: PropTypes.string,
    public: PropTypes.bool
  };

  static contextTypes = {
    i18n : React.PropTypes.object.isRequired,
  };

  constructor(props, context) {
    super(props);
    this.state = { businessPartner : null };

    this.api = new BusinessPartner();
  }

  componentWillMount(){
    this.context.i18n.register('BusinessPartner', i18nMessages);
  }

  componentDidMount() {
    this.loadBusinessPartner(this.props.businessPartnerId);
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if(nextContext.i18n){
      nextContext.i18n.register('BusinessPartner', i18nMessages);
    }

    this.loadBusinessPartner(nextProps.businessPartnerId);
  }

  renderDefault(argument, defaultValue) {
    return argument ? argument : defaultValue;
  }

  loadBusinessPartner(businessPartnerId) {
    if (!businessPartnerId) return;

    const queryParam = { include: 'addresses,capabilities,contacts,bankAccounts' };
    if (this.props.public) queryParam.public = true;
    this.api.find(businessPartnerId, queryParam).then(bp => this.setState({ businessPartner: bp }));
  }

  renderContactComponent() {
    if (!this.state.businessPartner.contacts) return null;

    return <ContactComponent businessPartner={this.state.businessPartner} i18n={this.context.i18n} />;
  }

  renderBankAccountComponent() {
    if (!this.state.businessPartner.bankAccounts) return null;

    return <BankAccountComponent businessPartner={this.state.businessPartner} i18n={this.context.i18n} />;
  }

  render() {
    const { businessPartner } = this.state;
    const { i18n } = this.context;

    return (
      <div className="form-horizontal">
        { businessPartner && (
          <div>
            <div className="col-sm-12">
                <span className='bp-public__label'>{ i18n.getMessage('BusinessPartner.Title.company') }</span>
                <div className='bp-public__section'>
                  <div className='col-sm-8'>
                    <h5 className='bp-public__fieldLabel col-sm-4'>{ i18n.getMessage('BusinessPartner.Label.name') }</h5>
                    <span className='bp-public__value col-sm-4'>{ businessPartner.name }</span>
                  </div>
                  <div className='col-sm-8'>
                    <h5 className='bp-public__fieldLabel col-sm-4'>{ i18n.getMessage('BusinessPartner.Label.cityOfRegistration') } </h5>
                    <span className='bp-public__value col-sm-4'>{ businessPartner.cityOfRegistration }</span>
                  </div>
                  <div className='col-sm-8'>
                    <h5 className='bp-public__fieldLabel col-sm-4'>{ i18n.getMessage('BusinessPartner.Label.legalForm') }</h5>
                    <span className='bp-public__value col-sm-4'>{ businessPartner.legalForm }</span>
                  </div>
                  <div className='col-sm-8'>
                    <h5 className='bp-public__fieldLabel col-sm-4'>{ i18n.getMessage('BusinessPartner.Label.homePage') }</h5>
                    <span className='bp-public__value col-sm-4'>{ businessPartner.homePage }</span>
                  </div>
                  <div className='col-sm-8'>
                    <h5 className='bp-public__fieldLabel col-sm-4'>{ i18n.getMessage('BusinessPartner.Label.taxIdNumber') }</h5>
                    <span className='bp-public__value col-sm-4'>{ this.renderDefault(businessPartner.taxIdNumber, '-') }</span>
                  </div>
                  <div className='col-sm-8'>
                    <h5 className='bp-public__fieldLabel col-sm-4'>{ i18n.getMessage('BusinessPartner.Label.commercialRegisterNo') }</h5>
                    <span className='cbp-public__value ol-sm-4'>{ this.renderDefault(businessPartner.commercialRegisterNo, '-') }</span>
                  </div>
                  <div className='col-sm-8'>
                    <h5 className='bp-public__fieldLabel col-sm-4'>{ i18n.getMessage('BusinessPartner.Label.countryOfRegistration') }</h5>
                    <span className='bp-public__value col-sm-4'><CountryView countryId={ businessPartner.countryOfRegistration } /></span>
                  </div>
                </div>
              </div>
            <div className="col-sm-12">
              <span className='bp-public__label'>{ i18n.getMessage('BusinessPartner.Title.companyIdentifiers') }</span>
              <div className='bp-public__section'>
                <div className='col-sm-8'>
                  <h5 className='bp-public__fieldLabel col-sm-4'>{ i18n.getMessage('BusinessPartner.Label.vatIdentificationNo') }</h5>
                  <span className='bp-public__value col-sm-4'>{ this.renderDefault(businessPartner.vatIdentificationNo, '-') }</span>
                </div>
                <div className='col-sm-8'>
                  <h5 className='bp-public__fieldLabel col-sm-4'>{ i18n.getMessage('BusinessPartner.Label.dunsNo') }</h5>
                  <span className='bp-public__value col-sm-4'>{ this.renderDefault(businessPartner.dunsNo, '-') }</span>
                </div>
                <div className='col-sm-8'>
                  <h5 className='bp-public__fieldLabel col-sm-4'>{ i18n.getMessage('BusinessPartner.Label.globalLocationNo') }</h5>
                  <span className='bp-public__value col-sm-4'>{ this.renderDefault(businessPartner.globalLocationNo, '-') }</span>
                </div>
              </div>
            </div>
            <AddressComponent businessPartner={ businessPartner } i18n={ i18n } />
            { this.renderContactComponent() }
            { this.renderBankAccountComponent() }
            { businessPartner.capabilities && businessPartner.capabilities.length > 0 &&
              <div className='col-sm-12'>
                <span className='bp-public__label'>{ i18n.getMessage('BusinessPartner.Capabilities.name') }</span>
                { businessPartner.capabilities.map((capabilities) => <div key={capabilities.capabilityId}>
                    <ul className='col-sm-8'>
                      <li className='col-sm-4'>{  i18n.getMessage(`BusinessPartner.Capabilities.Type.${capabilities.capabilityId}`) }</li>
                    </ul>
                  </div>
                ) }
              </div> }
          </div>
        ) }
      </div>
    );
  }
};
