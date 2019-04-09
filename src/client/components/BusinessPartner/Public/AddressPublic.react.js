import React from 'react';
import CountryView from '../../CountryView.react';

const AddressComponent = ({ businessPartner, i18n }) => (<div className='bp-public__container col-sm-12'>
    <span className='bp-public__label'>{ i18n.getMessage('BusinessPartner.Title.addresses') }</span>
    { businessPartner.addresses.map(add => <AddressSection key={add.id} address={ add } i18n={ i18n }/>)}
</div>);

const AddressSection = ({ address, i18n }) => (
  <div className='bp-public__section bp-public__address'>
    <div className='col-sm-8'>
      <label className='bp-public__subheading col-sm-4'>{ i18n.getMessage('BusinessPartner.Address.Label.type') }</label>
      <span className='bp-public__subheading col-sm-4'>{ i18n.getMessage(`BusinessPartner.Address.Type.${address.type}`) }</span>
    </div>
    <div className='col-sm-8'>
      <label className='bp-public__fieldLabel col-sm-4'>{ i18n.getMessage('BusinessPartner.Address.Label.name') }</label>
      <span className='bp-public__value col-sm-4'>{ address.name }</span>
    </div>
    <div className='col-sm-8'>
      <label className='bp-public__fieldLabel col-sm-4'>{ i18n.getMessage('BusinessPartner.Address.Label.street1') }</label>
      <span className='bp-public__value col-sm-4'>{ address.street1 || '-' }</span>
    </div>
    <div className='col-sm-8'>
      <label className='bp-public__fieldLabel col-sm-4'>{ i18n.getMessage('BusinessPartner.Address.Label.street2') }</label>
      <span className='bp-public__value col-sm-4'>{ address.street2 || '-' }</span>
    </div>
    <div className='col-sm-8'>
      <label className='bp-public__fieldLabel col-sm-4'>{ i18n.getMessage('BusinessPartner.Address.Label.street3') }</label>
      <span className='bp-public__value col-sm-4'>{ address.street3 || '-' }</span>
    </div>
    <div className='col-sm-8'>
      <label className='bp-public__fieldLabel col-sm-4'>{ i18n.getMessage('BusinessPartner.Address.Label.city') }</label>
      <span className='bp-public__value col-sm-4'>{ address.city }</span>
    </div>
    <div className='col-sm-8'>
      <label className='bp-public__fieldLabel col-sm-4'>{ i18n.getMessage('BusinessPartner.Address.Label.zipCode') }</label>
      <span className='bp-public__value col-sm-4'>{ address.zipCode || '-' }</span>
    </div>
    <div className='col-sm-8'>
      <label className='bp-public__fieldLabel col-sm-4'>{ i18n.getMessage('BusinessPartner.Address.Label.countryId') }</label>
      <span className='bp-public__value col-sm-4'>
        <CountryView countryId={ address.countryId} />
      </span>
    </div>
    <div className='col-sm-8'>
      <label className='bp-public__fieldLabel col-sm-4'>{ i18n.getMessage('BusinessPartner.Address.Label.email') }</label>
      <span className='bp-public__value col-sm-4'>{ address.email }</span>
    </div>
    <div className='col-sm-8'>
      <label className='bp-public__fieldLabel col-sm-4'>{ i18n.getMessage('BusinessPartner.Address.Label.phoneNo') }</label>
      <span className='bp-public__value col-sm-4'>{ address.phoneNo || '-' }</span>
    </div>
  </div>
);

export default AddressComponent;
