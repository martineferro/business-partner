const React = require('react');
const Components = require('@opuscapita/service-base-ui').Components;

module.exports.comRegTooltiptext = function(i18n) {
  return (
    `${i18n.getMessage('BusinessPartner.Messages.companyRegisterNumber.text')}
    <ul>
      <li>${i18n.getMessage('BusinessPartner.Messages.companyRegisterNumber.de')}</li>
      <li>${i18n.getMessage('BusinessPartner.Messages.companyRegisterNumber.at')}</li>
      <li>${i18n.getMessage('BusinessPartner.Messages.companyRegisterNumber.fi')}</li>
      <li>${i18n.getMessage('BusinessPartner.Messages.companyRegisterNumber.se')}</li>
      <li>${i18n.getMessage('BusinessPartner.Messages.companyRegisterNumber.no')}</li>
      <li>${i18n.getMessage('BusinessPartner.Messages.companyRegisterNumber.ch')}</li>
      <li>${i18n.getMessage('BusinessPartner.Messages.companyRegisterNumber.us')}</li>
      <li>${i18n.getMessage('BusinessPartner.Messages.companyRegisterNumber.pl')}</li>
      <li>${i18n.getMessage('BusinessPartner.Messages.companyRegisterNumber.fr')}</li>
    </ul>`
  );
};

module.exports.getEventValue = function(event) {
  if (event && event.target) return event.target.value;

  return event;
};

module.exports.fieldsForAdmin = function(action) {
  switch(action) {
    case 'create':
      return ['managed', 'isSupplier', 'isCustomer', 'id'];
    case 'update':
      return ['managed', 'isSupplier', 'isCustomer'];
    case 'register':
      return [];
    default:
      return [];
  }
}

module.exports.fieldsForUser = function(action) {
  switch(action) {
    case 'create':
    case 'update':
      return [
        'parentId', 'entityCode', 'name', 'homePage', 'foundedOn', 'legalForm', 'cityOfRegistration',
        'countryOfRegistration', 'currencyId', 'commercialRegisterNo', 'taxIdentificationNo',
        'vatIdentificationNo', 'noVatReason'
      ];
    case 'register':
      return [
        'name', 'cityOfRegistration', 'countryOfRegistration', 'commercialRegisterNo',
        'taxIdentificationNo', 'currencyId', 'vatIdentificationNo', 'noVatReason'
      ];
    default:
      return [];
  }
}

module.exports.fieldsForIdentifiers = function(action) {
  switch(action) {
    case 'create':
    case 'update':
      return ['globalLocationNo', 'dunsNo', 'ovtNo'];
    case 'register':
      return ['globalLocationNo', 'dunsNo', 'ovtNo', 'iban'];
    default:
      return [];
  }
}

module.exports.actionButtons = function(action) {
  switch(action) {
    case 'create':
    case 'update':
      return ['save'];
    case 'register':
      return ['cancel', 'continue'];
    default:
      return [];
  }
}

module.exports.helpInformation = function(action, i18n) {
  switch(action) {
    case 'create':
    case 'update':
      return (
        <div>
          <p>{i18n.getMessage('BusinessPartner.Messages.identifierRequired')}</p>
          <br />
        </div>
      );
    case 'register':
      return (
        <Components.HelpBox>
          <Components.HelpBoxItem title={i18n.getMessage('BusinessPartner.Heading.companyRegistration')}>
            <p>{i18n.getMessage('BusinessPartner.Messages.pageHelpText')}</p>
          </Components.HelpBoxItem>
        </Components.HelpBox>
      );
    default:
      return null;
  }
}
