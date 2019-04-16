class FieldConstraints {
  constructor(i18n) {
    this.constraints = constraints(i18n);
  }

  forField(fieldName) {
    return { [fieldName]: this.constraints[fieldName] }
  }

  get all() {
    return this.constraints;
  }
};

let constraints = function(i18n)
{
  return {
    type: {
      presence: {
        message: i18n.getMessage('BusinessPartnerValidatejs.blank.message')
      }
    },
    department: {
      presence: {
        message: i18n.getMessage('BusinessPartnerValidatejs.blank.message')
      }
    },
    title: {
      length: lengthConstraint(i18n, 20)
    },
    firstName: {
      presence: {
        message: i18n.getMessage('BusinessPartnerValidatejs.blank.message')
      },
      length: lengthConstraint(i18n, 100)
    },
    lastName: {
      presence: {
        message: i18n.getMessage('BusinessPartnerValidatejs.blank.message')
      },
      length: lengthConstraint(i18n, 100)
    },
    email: {
      presence: {
        message: i18n.getMessage('BusinessPartnerValidatejs.blank.message')
      },
      email: {
        message: i18n.getMessage('BusinessPartnerValidatejs.invalid.email.message')
      },
      length: lengthConstraint(i18n, 100)
    },
    phone: {
      length: lengthConstraint(i18n, 20)
    },
    mobile: {
      length: lengthConstraint(i18n, 20)
    },
    fax: {
      length: lengthConstraint(i18n, 20)
    }
  };
};

let lengthConstraint = function(i18n, limit)
{
  return {
    maximum: limit,
    tooLong: i18n.getMessage('BusinessPartnerValidatejs.invalid.maxSize.message', { limit: limit })
  };
}

export default FieldConstraints;
