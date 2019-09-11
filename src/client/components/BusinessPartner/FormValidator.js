const custom = require('../../utils/validatejs/custom.js');
const customAsync = require('../../utils/validatejs/customAsync.js');
const formatters = require('../../utils/validatejs/formatters');
const validatejs = require('validate.js');

class FormValidator {
  constructor(i18n, constraints, type = 'createOrUpdate') {
    this.constraints = constraints;
    this.validator = determineValidator(i18n, type);
    this.options = determineOptions(type)
  }

  validate(businessPartner) {
    return this.validator.async(businessPartner, this.constraints, this.options);
  }
};

let determineValidator = function(i18n, type)
{
  if (type === 'createOrUpdate') {
    validatejs.extend(validatejs.validators.datetime, {
      parse: function(value) {
        let date = new Date(value);
        if (isValidDate(date)) {
          return date.getTime();
        }
        return value.toString;
      },

      format: function(value) {
        const date = new Date(value);
        if (isValidDate(value)) {
          return i18n.formatDate(date);
        }
        return value;
      }
    });
  }

  return validator(validatejs);
};

let validator = function(validatejs) {
  custom.businessPartnerTypeSet(validatejs),
  custom.tenantId(validatejs);
  custom.vatNumber(validatejs);
  custom.dunsNumber(validatejs);
  custom.globalLocationNumber(validatejs);
  custom.iban(validatejs);
  custom.uniqueIdentifier(validatejs);
  custom.ovtNumber(validatejs);
  custom.comRegNumber(validatejs);
  customAsync.idExists(validatejs);
  customAsync.nameExists(validatejs);
  customAsync.registerationNumberExists(validatejs);
  customAsync.taxIdNumberExists(validatejs);
  customAsync.vatNumberExists(validatejs);
  customAsync.dunsNumberExists(validatejs);
  customAsync.ovtNumberExists(validatejs);
  customAsync.entityCodeExists(validatejs);
  customAsync.globalLocationNumberExists(validatejs);
  customAsync.ibanExists(validatejs);
  customAsync.uniqueIdentifierWithBankAccount(validatejs);
  formatters.groupedDetailed(validatejs);

  return validatejs;
};

let isValidDate = function(d)
{
  if (Object.prototype.toString.call(d) !== "[object Date]") {
    return false;
  }
  return !isNaN(d.getTime());
};

let determineOptions = function(type)
{
  let options = { fullMessages: false };

  if (type === 'registration') options['format'] = 'groupedDetailed';

  return options;
};

export default FormValidator;
