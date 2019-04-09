import React from 'react';
import { Components } from '@opuscapita/service-base-ui';

class FormAction {
  static get REGISTER() { return 'register'; }
  static get CREATE() { return 'create'; }
  static get UPDATE() { return 'update'; }
  static get TYPES() { return [this.REGISTER, this.CREATE, this.UPDATE]; }

  constructor(action, i18n) {
    this.action = action;
    this.i18n = i18n;
  }

  isRegister() {
    return this.action === FormAction.REGISTER;
  }

  fieldsForAdmin() {
    if (this.action === FormAction.CREATE) return ['managed', 'isSupplier', 'isCustomer', 'id'];

    if (this.action === FormAction.UPDATE) return ['managed', 'isSupplier', 'isCustomer'];

    return [];
  }

  fieldsForUser() {
    switch(this.action) {
      case FormAction.CREATE:
      case FormAction.UPDATE:
        return [
          'parentId', 'entityCode', 'name', 'homePage', 'foundedOn', 'legalForm', 'cityOfRegistration',
          'countryOfRegistration', 'currencyId', 'commercialRegisterNo', 'taxIdentificationNo',
          'vatIdentificationNo', 'noVatReason'
        ];
      case FormAction.REGISTER:
        return [
          'name', 'cityOfRegistration', 'countryOfRegistration', 'commercialRegisterNo',
          'taxIdentificationNo', 'currencyId', 'vatIdentificationNo', 'noVatReason'
        ];
      default:
        return [];
    }
  }

  fieldsForIdentifiers() {
    if ([FormAction.CREATE, FormAction.UPDATE].includes(this.action)) {
      return ['globalLocationNo', 'dunsNo', 'ovtNo'];
    }

    if (this.action === FormAction.REGISTER) return ['globalLocationNo', 'dunsNo', 'ovtNo', 'iban'];

    return [];
  }

  actionButtons() {
    if ([FormAction.CREATE, FormAction.UPDATE].includes(this.action)) return ['save'];

    if (this.action === FormAction.REGISTER) return ['cancel', 'continue'];

    return [];
  }

  getError(error, fieldName) {
    if (this.action !== FormAction.REGISTER) return { message: error };

    return {
      message: error.message,
      value: error.value,
      fieldName: fieldName,
      attributes: error.attributes,
      hasLink: error.validator && error.validator.includes('Exists'),
      linkMessage: this.i18n.getMessage('BusinessPartner.Button.requestAccess')
    };
  }

  getHelperText(text) {
    return this.action === FormAction.REGISTER ? text : null;
  }

  validatorType() {
    return this.action === FormAction.REGISTER ? 'registration' : 'createOrUpdate';
  }

  helpInformation() {
  switch(this.action) {
    case FormAction.CREATE:
    case FormAction.UPDATE:
      return (
        <div>
          <p>{this.i18n.getMessage('BusinessPartner.Messages.identifierRequired')}</p>
          <br />
        </div>
      );
    case FormAction.REGISTER:
      return (
        <Components.HelpBox>
          <Components.HelpBoxItem title={this.i18n.getMessage('BusinessPartner.Heading.companyRegistration')}>
            <p>{this.i18n.getMessage('BusinessPartner.Messages.pageHelpText')}</p>
          </Components.HelpBoxItem>
        </Components.HelpBox>
      );
    default:
      return null;
  }
}
}

export default FormAction;
