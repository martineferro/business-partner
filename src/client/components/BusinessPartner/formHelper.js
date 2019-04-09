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
