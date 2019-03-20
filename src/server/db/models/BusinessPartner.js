'use strict';
const Sequelize = require('sequelize');
const { VAT, DUNS, GLN, OVT, REGNO, TENANTID } = require('@opuscapita/field-validators');

module.exports.init = function(db, config) {
  /**
   * BusinessPartner - organization that provides Products to buyers.
   * @class BusinessPartner
   */
  let BusinessPartner = db.define('BusinessPartner',
  /** @lends BusinessPartner */
  {
    /** Unique identifier. It is generated based on name field by stripping spaces and invalid special chars and if required, a number is appended for uniqueness, e.g. OpusCapita Software GmbH -> OpuscapitaSoftwareGmbh */
    id: {
      type: Sequelize.STRING(30),
      primaryKey: true,
      allowNull: false,
      validate: {
        isValid(value) {
          if (TENANTID.isInvalid(value))
            throw new Error('ID is invalid. Only characters, hyphens, underscore and numbers are allowed. May not start with number, hyphen or underscore. May not end with hyphen or underscore.');
        }
      }
    },
    /** ID of tenant the businessPartner belongs to. */
    tenantId: {
      allowNull: false,
      type: Sequelize.STRING(30)
    },
    /** Boolean to identify if businessPartner is a customer. */
    isCustomer: {
      allowNull: true,
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    /** Boolean to identify if businessPartner is a supplier. */
    isSupplier: {
      allowNull: true,
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    /** Code used to identify child companies. It can be the code from an external system, e.g. SAP. Must be added if the child companies have the same VAT ID */
    entityCode: {
      allowNull: true,
      type: Sequelize.STRING(30)
    },
    /** BusinessPartner id of parent company */
    parentId: {
      allowNull: true,
      type: Sequelize.STRING(30)
    },
    /** BusinessPartner ids of all parent companies in descending order, seperated by pipe special character */
    hierarchyId: {
      allowNull: true,
      type: Sequelize.STRING(900)
    },
    /** Company name */
    name: {
      allowNull: false,
      type: Sequelize.STRING(100),
      validate: {
        notEmpty: true
      }
    },
    /** Informational string about this BusinessPartner */
    information: {
      allowNull: true,
      type: Sequelize.STRING(100)
    },
    /** Date of establishment */
    foundedOn: {
      allowNull: true,
      type: Sequelize.DATE()
    },
    /** company legal form. E.g. Gmbh, AG for Germany */
    legalForm: {
      allowNull: true,
      type: Sequelize.STRING(250)
    },
    /** Companies are usually registered officially into a commercial register or trading register. The actual rules differ by country but generally allow to uniquely identify a company and inspect some of the related information in a public register. */
    commercialRegisterNo: {
      allowNull: true,
      type: Sequelize.STRING(250)
    },
    /** A supplier's city of registration */
    cityOfRegistration: {
      allowNull: true,
      type: Sequelize.STRING(250)
    },
    /** A supplier's country of registration as in ISO 3166-1 alpha2 */
    countryOfRegistration: {
      allowNull: true,
      type: Sequelize.STRING(2)
    },
    /** A supplier's default currency as in ISO 4217 ID of currency */
    currencyId: {
      allowNull: true,
      type: Sequelize.STRING(3)
    },
    /** A Tax Identification Number or TIN */
    taxIdentificationNo: {
      allowNull: true,
      type: Sequelize.STRING(20)
    },
    /** A value added tax identification number or VAT identification number (VATIN) */
    vatIdentificationNo: {
      allowNull: true,
      type: Sequelize.STRING(20),
      validate: {
        isValid(value) {
          if (value.length === 0) return;

          if (VAT.isInvalid(value)) throw new Error('vatIdentificationNo value is invalid');
        }
      }
    },
    /** A Global Location Number (GLN) is a unique number that is assigned to locations to enable them to be identified uniquely worldwide. See https://en.wikipedia.org/wiki/Global_Location_Number */
    globalLocationNo: {
      allowNull: true,
      type: Sequelize.STRING(250),
      validate: {
        isValid(value) {
          if (value.length === 0) return;

          if (GLN.isInvalid(value)) throw new Error('globalLocationNo value is invalid');
        }
      }
    },
    /** Company homepage url */
    homePage: {
      allowNull: true,
      type: Sequelize.STRING(250)
    },
    /** Duns stands for 'Data Universal Numbering System'. It is a nine-digit number issued by D&B (Dun & Bradstreet) and assigned to each business location in the D&B database */
    dunsNo: {
      allowNull: true,
      type: Sequelize.STRING(250),
      validate: {
        isValid(value) {
          if (value.length === 0) return;

          if (DUNS.isInvalid(value)) throw new Error('dunsNo value is invalid');
        }
      }
    },
    /** The Finnish Party Identification number (OVT-number) is a 12-17 digit number and it is generated from Business ID. */
    ovtNo: {
      allowNull: true,
      type: Sequelize.STRING(250),
      validate: {
        isValid(value) {
          if (value.length === 0) return;

          if (OVT.isInvalid(value)) throw new Error('ovtNo value is invalid');
        }
      }
    },
    /** Reason for not having a VATID */
    noVatReason: {
      allowNull: true,
      type: Sequelize.STRING(500)
    },
    /** Indicating where this businessPartner is in its lifecycle, e.g. onboarding, waitingForValidation, live, deleted. */
    statusId: {
      allowNull: true,
      type: Sequelize.STRING(100)
    },
    /** Boolean used to identify if a supplier account is managed by a user or not. */
    managed: {
      allowNull: true,
      type: Sequelize.BOOLEAN,
      defaultValue : true
    },
    changedBy: {
      allowNull : true,
      type: Sequelize.STRING(60),
    },
    createdBy: {
      allowNull : false,
      type: Sequelize.STRING(60)
    },
    createdOn: {
      allowNull : false,
      type: Sequelize.DATE()
    },
    changedOn: {
      allowNull : true,
      type: Sequelize.DATE()
    }
  }, {
    validate: {
      validCommercialRegisterNo() {
        if (!this.commercialRegisterNo || !this.countryOfRegistration) return;

        if (REGNO.isInvalid(this.commercialRegisterNo, this.countryOfRegistration))
          throw new Error('commercialRegisterNo value is invalid');
      }
    },
    updatedAt: 'changedOn',
    createdAt: 'createdOn',
    timestamps: true,
    freezeTableName: true,
    tableName: 'BusinessPartner'
  });

  return Promise.resolve();
};
