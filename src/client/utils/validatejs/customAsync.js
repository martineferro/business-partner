const { BusinessPartner, BankAccount, BusinessLink } = require('../../api');
const businessPartnerApi = new BusinessPartner();
const bankAccountApi = new BankAccount();
const businessLinkApi = new BusinessLink();

module.exports.idExists = function(validate) {
  return validate.validators.idExists = function(value, options, key, attributes) {
    let queryParams = { id: value };

    return recordExists(value, validate, queryParams, options.message);
  };
};

module.exports.nameExists = function(validate) {
  return validate.validators.nameExists = function(value, options, key, attributes) {
    let queryParams = { name: value };

    return recordExists(value, validate, queryParams, options.message, attributes.id);
  };
};

module.exports.vatNumberExists = function(validate) {
  return validate.validators.vatNumberExists = function(value, options, key, attributes) {
    let queryParams = { vatIdentificationNo: value, parentId: attributes.parentId || attributes.id, notEqual: true };

    return recordExists(value, validate, queryParams, options.message, attributes.id);
  };
};

module.exports.dunsNumberExists = function(validate) {
  return validate.validators.dunsNumberExists = function(value, options, key, attributes) {
    let queryParams = { dunsNo: value, parentId: attributes.parentId || attributes.id, notEqual: true };

    return recordExists(value, validate, queryParams, options.message, attributes.id);
  };
};

module.exports.ovtNumberExists = function(validate) {
  return validate.validators.ovtNumberExists = function(value, options, key, attributes) {
    let queryParams = { ovtNo: value };

    return recordExists(value, validate, queryParams, options.message, attributes.id);
  };
};

module.exports.globalLocationNumberExists = function(validate) {
  return validate.validators.globalLocationNumberExists = function(value, options, key, attributes) {
    let queryParams = { globalLocationNo: value }

    return recordExists(value, validate, queryParams, options.message, attributes.id);
  };
};

module.exports.ibanExists = function(validate) {
  return validate.validators.ibanExists = function(value, options, key, attributes) {
    let queryParams = { accountNumber: value }
    return new validate.Promise((resolve, reject) => {
      if (!value) { resolve(); return; }

      if (attributes.businessPartnerId) queryParams.businessPartnerId = attributes.businessPartnerId;

      bankAccountApi.exists(queryParams).then(bankAccount => {
        if (bankAccount) {
          resolve(options.message);
        } else {
          resolve();
        }
      }).catch(error => reject());
    });
  };
};

module.exports.taxIdNumberExists = function(validate) {
  return validate.validators.taxIdNumberExists = function(value, options, key, attributes) {
    let queryParams = {
      taxIdentificationNo: attributes.taxIdentificationNo,
      cityOfRegistration: attributes.cityOfRegistration
    };

    return recordExists(attributes.taxIdentificationNo, validate, queryParams, options.message, attributes.id);
  };
};


module.exports.registerationNumberExists = function(validate) {
  return validate.validators.registerationNumberExists = function(value, options, key, attributes) {
    let queryParams = {
      commercialRegisterNo: attributes.commercialRegisterNo,
      countryOfRegistration: attributes.countryOfRegistration,
      cityOfRegistration: attributes.cityOfRegistration
    };

    return recordExists(queryParams.commercialRegisterNo, validate, queryParams, options.message, attributes.id);
  };
};

module.exports.entityCodeExists = function(validate) {
  return validate.validators.entityCodeExists = function(value, options, key, attributes) {
    let queryParams = {
      entityCode: attributes.entityCode,
      parentId: attributes.parentId,
      vatIdentificationNo: attributes.vatIdentificationNo
    };

    const entityCode = attributes.parentId ? attributes.entityCode : null;

    return recordExists(entityCode, validate, queryParams, options.message, attributes.id);
  };
};

module.exports.uniqueIdentifierWithBankAccount = function(validate) {
  return validate.validators.uniqueIdentifierWithBankAccount = function(value, options, key, attributes) {
    return new validate.Promise((resolve, reject) => {
      const uniqueIdentifier = require('../../../server/utils/validators/uniqueIdentifier.js');
      const fields = [attributes.vatIdentificationNo, attributes.dunsNo, attributes.globalLocationNo, attributes.ovtNo];
      if (uniqueIdentifier.isValid(fields)) { resolve(); return; }

      if (!attributes.id) { resolve(); return; }

      bankAccountApi.all(attributes.id).then(accounts => {
        if (accounts.length > 0) {
          resolve();
        } else {
          resolve(options.message);
        }
      }).catch(error => reject());
    });
  };
};

module.exports.businessLinkExists = function(validate) {
  return validate.validators.businessLinkExists = function(value, options, key, attributes) {
    return new validate.Promise((resolve, reject) => {
      if (attributes.id) { resolve(); return; }

      const supplierId = attributes.supplierId;
      const customerId = attributes.customerId;

      if (!supplierId || !customerId) { resolve(); return; }

      businessLinkApi.exists(supplierId, customerId).then(exists => {
        if (exists) {
          resolve(options.message);
        } else {
          resolve();
        }
      }).catch(error => reject());
    });
  };
};

let recordExists = function(value, validate, queryParams, errorMessage, businessPartnerId) {
  return new validate.Promise((resolve, reject) => {
    if (!value) { resolve(); return; }

    if (businessPartnerId) queryParams.businessPartnerId = businessPartnerId;
    businessPartnerApi.exists(queryParams).then(supplier => {
      if (supplier) {
        resolve(errorMessage);
      } else {
        resolve();
      }
    }).catch(error => reject());
  });
};
