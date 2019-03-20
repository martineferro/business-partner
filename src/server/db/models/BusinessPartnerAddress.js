'use strict';

const Promise = require('bluebird');
const Sequelize = require('sequelize');

const TYPE = { DEFAULT: 'default', INVOICE: 'invoice', RMA: 'rma', PLANT: 'plant', DELIVERY: 'delivery' };

module.exports.TYPE = TYPE;

module.exports.init = function(db, config) {
  /**
   * Data model representing a single customer item.
   * @class BusinessPartnerAddress
   */
  var BusinessPartnerAddress = db.define('BusinessPartnerAddress',
  /** @lends BusinessPartnerAddress */
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    businessPartnerId: {
      type: Sequelize.STRING(30),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true
      }
    },
    type: {
      type: Sequelize.STRING(10),
      allowNull: false,
      defaultValue: "default",
      validate: {
        isIn: [Object.values(TYPE)]
      }
    },
    name: {
      type: Sequelize.STRING(50),
      allowNull: true
    },
    street1: {
      type: Sequelize.STRING(100),
      allowNull: false
    },
    street2: {
      type: Sequelize.STRING(100),
      allowNull: true
    },
    street3: {
      type: Sequelize.STRING(100),
      allowNull: true
    },
    zipCode: {
      type: Sequelize.STRING(10),
      allowNull: true
    },
    city: {
      type: Sequelize.STRING(50),
      allowNull: false
    },
    poboxZipCode: {
      type: Sequelize.STRING(10),
      allowNull: true
    },
    pobox: {
      type: Sequelize.STRING(10),
      allowNull: true
    },
    areaCode: {
      type: Sequelize.STRING(10),
      allowNull: true
    },
    phoneNo: {
      type: Sequelize.STRING(50),
      allowNull: true
    },
    faxNo: {
      type: Sequelize.STRING(50),
      allowNull: true
    },
    email: {
      type: Sequelize.STRING(1024),
      allowNull: true,
      validate: {
        isEmail: true
      }
    },
    corporateURL: {
      type: Sequelize.STRING(1024),
      allowNull: true,
      validate: {
        isUrl: true
      }
    },
    numOfEmployees: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    countryId: {
      type: Sequelize.STRING(2),
      allowNull: false
    },
    state: {
      type: Sequelize.STRING(50),
      allowNull: true
    },
    changedBy: {
      type: Sequelize.STRING(60)
    },
    createdBy: {
      type: Sequelize.STRING(60)
    },
    createdOn: {
      type: Sequelize.DATE
    },
    changedOn: {
      type: Sequelize.DATE
    }
  }, {
    updatedAt: 'changedOn',
    createdAt: 'createdOn',
    timestamps: true,
    freezeTableName: true,
    tableName: 'BusinessPartnerAddress'
  });

  return Promise.resolve();
};
