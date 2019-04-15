const custom = require('../../../utils/validatejs/custom.js');
const customAsync = require('../../../utils/validatejs/customAsync.js');
const validatejs = require('validate.js');

class FormValidator {
  constructor(constraints) {
    this.constraints = constraints;
    this.validator = determineValidator();
    this.options = { fullMessages: false };
  }

  validate(bankAccount) {
    return this.validator.async(bankAccount, this.constraints, this.options);
  }
};

let determineValidator = function()
{
  custom.iban(validatejs);
  custom.bic(validatejs);
  custom.isrNumber(validatejs);
  custom.uniqueIdentifier(validatejs);
  custom.bicRequired(validatejs);
  customAsync.ibanExists(validatejs);

  return validatejs;
}

export default FormValidator;
