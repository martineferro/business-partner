import React from 'react';
import CountryView from '../../CountryView.react';

const BankAccountComponent = ({ businessPartner, i18n }) => (<div className='bp-public__container col-sm-12'>
    <span className='bp-public__label'>{ i18n.getMessage('BusinessPartner.Title.bankAccounts') }</span>
    { businessPartner.bankAccounts.map(ba => <BankAccountSection key={ba.id} bankAccount={ ba } i18n={ i18n }/>)}
</div>);

const BankAccountSection = ({ bankAccount, i18n }) => (
  <div className='bp-public__section bp-public__bankAccount'>
    <div className='col-sm-8'>
      <label className='bp-public__fieldLabel col-sm-4'>{ i18n.getMessage('BusinessPartner.BankAccount.Label.bankName') }</label>
      <span className='bp-public__value col-sm-4'>{ bankAccount.bankName || '-'}</span>
    </div>
    <div className='col-sm-8'>
      <label className='bp-public__fieldLabel col-sm-4'>{ i18n.getMessage('BusinessPartner.BankAccount.Label.accountNumber') }</label>
      <span className='bp-public__value col-sm-4'>{ bankAccount.accountNumber || '-' }</span>
    </div>
    <div className='col-sm-8'>
      <label className='bp-public__fieldLabel col-sm-4'>{ i18n.getMessage('BusinessPartner.BankAccount.Label.bankIdentificationCode') }</label>
      <span className='bp-public__value col-sm-4'>{ bankAccount.bankIdentificationCode || '-' }</span>
    </div>
    <div className='col-sm-8'>
      <label className='bp-public__fieldLabel col-sm-4'>{ i18n.getMessage('BusinessPartner.BankAccount.Label.bankCode') }</label>
      <span className='bp-public__value col-sm-4'>{ bankAccount.bankCode || '-' }</span>
    </div>
    <div className='col-sm-8'>
      <label className='bp-public__fieldLabel col-sm-4'>{ i18n.getMessage('BusinessPartner.BankAccount.Label.bankCountryKey') }</label>
      <span className='bp-public__value col-sm-4'>
        <CountryView countryId={ bankAccount.bankCountryKey} />
      </span>
    </div>
    <div className='col-sm-8'>
      <label className='bp-public__fieldLabel col-sm-4'>{ i18n.getMessage('BusinessPartner.BankAccount.Label.extBankControlKey') }</label>
      <span className='bp-public__value col-sm-4'>{ bankAccount.extBankControlKey || '-'}</span>
    </div>
  </div>
);

export default BankAccountComponent;
