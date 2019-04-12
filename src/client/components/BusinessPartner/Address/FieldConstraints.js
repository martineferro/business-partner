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
      presence: { message: i18n.getMessage('BusinessPartnerValidatejs.blank.message') }
    },
    "name": {
      presence: { message: i18n.getMessage('BusinessPartnerValidatejs.blank.message') },
      length: lengthConstraint(i18n, 100)
    },
    "street1": {
      presence: { message: i18n.getMessage('BusinessPartnerValidatejs.blank.message') },
      length: lengthConstraint(i18n, 50)
    },
    "street2": {
      length: lengthConstraint(i18n, 100)
    },
    "street3": {
      length: lengthConstraint(i18n, 100)
    },
    "zipCode": {
      presence: { message: i18n.getMessage('BusinessPartnerValidatejs.blank.message') },
      length: lengthConstraint(i18n, 10)
    },
    "city": {
      presence: { message: i18n.getMessage('BusinessPartnerValidatejs.blank.message') },
      length: lengthConstraint(i18n, 50)
    },
    "countryId": {
      presence: { message: i18n.getMessage('BusinessPartnerValidatejs.blank.message') }
    },
    "areaCode": {
      length: lengthConstraint(i18n, 10)
    },
    "state": {
      length: lengthConstraint(i18n, 50)
    },
    "pobox": {
      length: lengthConstraint(i18n, 10)
    },
    "poboxZipCode": {
      length: lengthConstraint(i18n, 10)
    },
    "phoneNo": {
      presence: { message: i18n.getMessage('BusinessPartnerValidatejs.blank.message') },
      length: lengthConstraint(i18n, 50)
    },
    "faxNo": {
      length: lengthConstraint(i18n, 50)
    },
    "email": {
      length: lengthConstraint(i18n, 1024),
      email: {
        message: i18n.getMessage('BusinessPartnerValidatejs.invalid.email.message')
      }
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
