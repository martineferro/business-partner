class FieldConstraints {
  constructor(i18n) {
    this.i18n = i18n;
    this.constraints = allConstraints(i18n);
  }

  forCreate() {
    let constraints = this.cloneConstraints();
    delete constraints.iban;
    delete constraints.vatIdentificationNo.uniqueIdentifier;
    delete constraints.globalLocationNo.uniqueIdentifier;
    delete constraints.dunsNo.uniqueIdentifier;
    delete constraints.ovtNo.uniqueIdentifier;
    delete constraints.vatIdentificationNo.uniqueIdentifierWithBankAccount;
    delete constraints.globalLocationNo.uniqueIdentifierWithBankAccount;
    delete constraints.dunsNo.uniqueIdentifierWithBankAccount;
    delete constraints.ovtNo.uniqueIdentifierWithBankAccount;

    return constraints;
  }

  forUpdate() {
    let constraints = this.cloneConstraints();
    delete constraints.id;
    delete constraints.iban;
    delete constraints.vatIdentificationNo.uniqueIdentifier;
    delete constraints.globalLocationNo.uniqueIdentifier;
    delete constraints.dunsNo.uniqueIdentifier;
    delete constraints.ovtNo.uniqueIdentifier;

    return constraints;
  }

  forRegistration() {
    let constraints = this.cloneConstraints();

    delete constraints.homePage;
    delete constraints.foundedOn;
    delete constraints.legalForm;
    delete constraints.vatIdentificationNo.uniqueIdentifierWithBankAccount;
    delete constraints.globalLocationNo.uniqueIdentifierWithBankAccount;
    delete constraints.dunsNo.uniqueIdentifierWithBankAccount;
    delete constraints.ovtNo.uniqueIdentifierWithBankAccount;

    return constraints;
  }

  forField(fieldName) {
    if (['taxIdentificationNo', 'cityOfRegistration'].includes(fieldName))
      return {
        taxIdentificationNo: this.constraints['taxIdentificationNo'],
        cityOfRegistration: this.constraints['cityOfRegistration']
      };

    if (['commercialRegisterNo', 'countryOfRegistration'].includes(fieldName))
      return {
        commercialRegisterNo: this.constraints['commercialRegisterNo'],
        countryOfRegistration: this.constraints['countryOfRegistration']
      };

    if (fieldName === 'entityCode')
      return {
        entityCode: this.constraints['entityCode'],
        vatIdentificationNo: this.constraints['vatIdentificationNo']
      };

    if (['vatIdentificationNo', 'dunsNo', 'globalLocationNo', 'iban', 'ovtNo'].includes(fieldName))
      return {
        vatIdentificationNo: this.constraints['vatIdentificationNo'],
        dunsNo: this.constraints['dunsNo'],
        globalLocationNo: this.constraints['globalLocationNo'],
        iban: this.constraints['iban'],
        ovtNo: this.constraints['ovtNo'],
      };

    return { [fieldName]: this.constraints[fieldName] };
  }

  addPresence(fieldName) {
    this.constraints[fieldName].presence = { message: this.i18n.getMessage('BusinessPartnerValidatejs.blank.message') };
  }

  removePresence(fieldName) {
    this.constraints[fieldName].presence = false;
  }

  cloneConstraints() {
    return Object.assign({}, this.constraints);
  }
}

let allConstraints = function(i18n) {
  return {
    id: {
      presence: false,
      length: {
        maximum: 30,
        tooLong: i18n.getMessage('BusinessPartnerValidatejs.invalid.maxSize.message', { limit: 30 })
      },
      tenantId: {
        message: i18n.getMessage('BusinessPartnerValidatejs.invalid.id.message')
      },
      idExists: {
        message: i18n.getMessage('BusinessPartnerValidatejs.businessPartnerExists', {
          message: i18n.getMessage('BusinessPartnerValidatejs.duplicate.id.message')
        })
      }
    },
    name: {
      presence: {
        message: i18n.getMessage('BusinessPartnerValidatejs.blank.message')
      },
      length: {
        maximum: 100,
        tooLong: i18n.getMessage('BusinessPartnerValidatejs.invalid.maxSize.message', {
          limit: 100
        })
      },
      nameExists: {
        message: i18n.getMessage('BusinessPartnerValidatejs.businessPartnerExists', {
          message: i18n.getMessage('BusinessPartnerValidatejs.duplicate.name.message')
        })
      }
    },
    homePage: {
      presence: false,
      length: {
        maximum: 250,
        tooLong: i18n.getMessage('BusinessPartnerValidatejs.invalid.maxSize.message', {
          limit: 250
        })
      }
    },
    foundedOn: {
      presence: false,
      datetime: {
        message: i18n.getMessage('BusinessPartnerValidatejs.typeMismatch.util.Date')
      }
    },
    legalForm: {
      presence: false,
      length: {
        maximum: 250,
        tooLong: i18n.getMessage('BusinessPartnerValidatejs.invalid.maxSize.message', {
          limit: 250
        })
      }
    },
    commercialRegisterNo: {
      presence: false,
      comRegNumber: {
        message: i18n.getMessage('BusinessPartnerValidatejs.invalid.comRegNumber.message')
      },
      registerationNumberExists: {
        message: i18n.getMessage('BusinessPartnerValidatejs.businessPartnerExists', {
          message: i18n.getMessage('BusinessPartnerValidatejs.duplicate.registerationNumber.message')
        })
      }
    },
    cityOfRegistration: {
      presence: {
        message: i18n.getMessage('BusinessPartnerValidatejs.blank.message')
      },
      length: {
        maximum: 250,
        tooLong: i18n.getMessage('BusinessPartnerValidatejs.invalid.maxSize.message', {
          limit: 250
        })
      }
    },
    countryOfRegistration: {
      presence: {
        message: i18n.getMessage('BusinessPartnerValidatejs.blank.message')
      }
    },
    taxIdentificationNo: {
      presence: false,
      taxIdNumberExists: {
        message: i18n.getMessage('BusinessPartnerValidatejs.businessPartnerExists', {
          message: i18n.getMessage('BusinessPartnerValidatejs.duplicate.taxIdNumber.message')
        })
      }
    },
    vatIdentificationNo: {
      presence: false,
      vatNumber: {
        message: i18n.getMessage('BusinessPartnerValidatejs.invalid.vatNumber.message')
      },
      vatNumberExists: {
        message: i18n.getMessage('BusinessPartnerValidatejs.businessPartnerExists', {
          message: i18n.getMessage('BusinessPartnerValidatejs.duplicate.vatNumber.message')
        })
      },
      uniqueIdentifier: {
        message: i18n.getMessage('BusinessPartnerValidatejs.invalid.uniqueIdentifier.message')
      },
      uniqueIdentifierWithBankAccount: {
        message: i18n.getMessage('BusinessPartnerValidatejs.invalid.uniqueIdentifierWithBankAccount.message')
      }
    },
    globalLocationNo: {
      presence: false,
      globalLocationNumber: {
        message: i18n.getMessage('BusinessPartnerValidatejs.invalid.globalLocationNumber.message')
      },
      globalLocationNumberExists: {
        message: i18n.getMessage('BusinessPartnerValidatejs.businessPartnerExists', {
          message: i18n.getMessage('BusinessPartnerValidatejs.duplicate.globalLocationNumber.message')
        })
      },
      uniqueIdentifier: {
        message: i18n.getMessage('BusinessPartnerValidatejs.invalid.uniqueIdentifier.message')
      },
      uniqueIdentifierWithBankAccount: {
        message: i18n.getMessage('BusinessPartnerValidatejs.invalid.uniqueIdentifierWithBankAccount.message')
      }
    },
    dunsNo: {
      presence: false,
      dunsNumber: {
        message: i18n.getMessage('BusinessPartnerValidatejs.invalid.dunsNumber.message')
      },
      dunsNumberExists: {
        message: i18n.getMessage('BusinessPartnerValidatejs.businessPartnerExists', {
          message: i18n.getMessage('BusinessPartnerValidatejs.duplicate.dunsNumber.message')
        })
      },
      uniqueIdentifier: {
        message: i18n.getMessage('BusinessPartnerValidatejs.invalid.uniqueIdentifier.message')
      },
      uniqueIdentifierWithBankAccount: {
        message: i18n.getMessage('BusinessPartnerValidatejs.invalid.uniqueIdentifierWithBankAccount.message')
      }
    },
    ovtNo: {
      presence: false,
      ovtNumber: {
        message: i18n.getMessage('BusinessPartnerValidatejs.invalid.ovtNumber.message')
      },
      ovtNumberExists: {
        message: i18n.getMessage('BusinessPartnerValidatejs.businessPartnerExists', {
          message: i18n.getMessage('BusinessPartnerValidatejs.duplicate.ovtNumber.message')
        })
      },
      uniqueIdentifier: {
        message: i18n.getMessage('BusinessPartnerValidatejs.invalid.uniqueIdentifier.message')
      },
       uniqueIdentifierWithBankAccount: {
        message: i18n.getMessage('BusinessPartnerValidatejs.invalid.uniqueIdentifierWithBankAccount.message')
      }
    },
    iban: {
      presence: false,
      iban: {
        message: i18n.getMessage('BusinessPartnerValidatejs.invalid.iban.message')
      },
      ibanExists: {
        message: i18n.getMessage('BusinessPartnerValidatejs.businessPartnerExists', {
          message: i18n.getMessage('BusinessPartnerValidatejs.duplicate.iban.message')
        })
      },
      uniqueIdentifier: {
        message: i18n.getMessage('BusinessPartnerValidatejs.invalid.uniqueIdentifier.message')
      }
    },
    entityCode: {
      presence: false,
      entityCodeExists: {
        message: i18n.getMessage('BusinessPartnerValidatejs.duplicate.entityCode.message')
      }
    }
  };
};

export default FieldConstraints;
