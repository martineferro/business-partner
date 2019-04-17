const customAsync = require('../../../utils/validatejs/customAsync.js');
const validatejs = require('validate.js');

class FormValidator {
  constructor(constraints) {
    this.constraints = constraints;
    this.validator = determineValidator();
    this.options = { fullMessages: false };
  }

  validate(businessLink) {
    return this.validator.async(businessLink, this.constraints, this.options);
  }
};

let determineValidator = function()
{
  customAsync.businessLinkExists(validatejs);

  return validatejs;
}

export default FormValidator;

