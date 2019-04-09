import React from 'react';

const ContactComponent = ({ businessPartner, i18n }) => (<div className='bp-public__container col-sm-12'>
    <span className='bp-public__label'>{ i18n.getMessage('BusinessPartner.Title.contacts') }</span>
    { businessPartner.contacts.map((contact) => <ContactSection key={contact.id} businessPartner={ businessPartner } contact={ contact } i18n={ i18n }/>)}
</div>);

const ContactSection = ({ contact, businessPartner, i18n }) => (
  <div className='bp-public__section bp-public__contact'>
    <div className='col-sm-8'>
      <label className='bp-public__subheading col-sm-4'>{ i18n.getMessage('BusinessPartner.Contact.Label.contactType') }</label>
      <span className='bp-public__subheading col-sm-4'>{ i18n.getMessage(`BusinessPartner.Contact.Type.${contact.type}`) }</span>
    </div>
    <div className='col-sm-8'>
      <label className='bp-public__fieldLabel col-sm-4'>{ i18n.getMessage('BusinessPartner.Contact.Label.department') }</label>
      <span className='bp-public__value col-sm-4'>{ contact.department ? i18n.getMessage(`BusinessPartner.Contact.Department.${contact.department}`) : '-'}</span>
    </div>
    <div className='col-sm-8'>
      <label className='bp-public__fieldLabel col-sm-4'>{ i18n.getMessage('BusinessPartner.Contact.Label.title') }</label>
      <span className='bp-public__value col-sm-4'>{ contact.title || '-'}</span>
    </div>
    <div className='col-sm-8'>
      <label className='bp-public__fieldLabel col-sm-4'>{ i18n.getMessage('BusinessPartner.Contact.Label.firstName') }</label>
      <span className='bp-public__value col-sm-4'>{ contact.firstName || '-' }</span>
    </div>
    <div className='col-sm-8'>
      <label className='bp-public__fieldLabel col-sm-4'>{ i18n.getMessage('BusinessPartner.Contact.Label.lastName') }</label>
      <span className='bp-public__value col-sm-4'>{ contact.lastName || '-' }</span>
    </div>
    <div className='col-sm-8'>
      <label className='bp-public__fieldLabel col-sm-4'>{ i18n.getMessage('BusinessPartner.Contact.Label.email') }</label>
      <span className='bp-public__value col-sm-4'>{ contact.email || '-' }</span>
    </div>
    <div className='col-sm-8'>
      <label className='bp-public__fieldLabel col-sm-4'>{ i18n.getMessage('BusinessPartner.Contact.Label.phone') }</label>
      <span className='bp-public__value col-sm-4'>{ contact.phone || '-' }</span>
    </div>
    <div className='col-sm-8'>
      <label className='bp-public__fieldLabel col-sm-4'>{ i18n.getMessage('BusinessPartner.Contact.Label.mobile') }</label>
      <span className='bp-public__value col-sm-4'>{ contact.mobile || '-' }</span>
    </div>
    <div className='col-sm-8'>
      <label className='bp-public__fieldLabel col-sm-4'>{ i18n.getMessage('BusinessPartner.Contact.Label.fax') }</label>
      <span className='bp-public__value col-sm-4'>{ contact.fax || '-'}</span>
    </div>
  </div>
);

export default ContactComponent;
