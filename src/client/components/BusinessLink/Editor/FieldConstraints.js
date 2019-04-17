class FieldConstraints {
  constructor(i18n) {
    this.constraints = allConstraints(i18n);
  }

  forField(fieldName) {
    return { ...this.determineFields(fieldName), id: {} };
  }

  determineFields(fieldName) {
    if (['supplierId', 'customerId'].includes(fieldName))
      return { supplierId: this.constraints.supplierId, customerId: this.constraints.customerId };

    return { [fieldName]: this.constraints[fieldName] || {} };
  }

  get all() {
    return { ...this.constraints, id: {} };
  }
};

let allConstraints = function(i18n) {
  return {
    supplierId: {
      presence: {
        message: i18n.getMessage('BusinessPartnerValidatejs.blank.message')
      },
      businessLinkExists: {
        message: i18n.getMessage('BusinessPartnerValidatejs.duplicate.businessLink.message')
      }
    },
    customerId: {
      presence: {
        message: i18n.getMessage('BusinessPartnerValidatejs.blank.message')
      },
      businessLinkExists: {
        message: i18n.getMessage('BusinessPartnerValidatejs.duplicate.businessLink.message')
      }
    }
  };
};

export default FieldConstraints;
