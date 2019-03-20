'use strict';
const Sequelize = require('sequelize');

const TYPE = {
  DEFAULT: 'default',
  SALES: 'sales',
  ESCALATION: 'escalation',
  PRODUCT: 'product',
  TECHNICAL: 'technical'
};

const DEPARTMENT = {
  MANAGEMENT: 'management',
  LOGISTICS: 'logistics',
  SALES: 'sales',
  ACCOUNTING: 'accounting',
  SUPPORT: 'support',
  IT: 'it',
  OTHERS: 'others'
};

module.exports.TYPE = TYPE;
module.exports.DEPARTMENT = DEPARTMENT;

module.exports.init = function(db, config) {
  /**
   * BusinessPartnerContact - Contact information for a businessPartner.
   * @class BusinessPartnerContact
   */
  let BusinessPartnerContact = db.define('BusinessPartnerContact',
  /** @lends BusinessPartnerContact */
  {
    /** Unique identifier */
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    businessPartnerId: {
      allowNull: false,
      type: Sequelize.STRING(30)
    },
    title: {
      allowNull: true,
      type: Sequelize.STRING(20)
    },
    type: {
      allowNull: true,
      type: Sequelize.STRING(10),
      validate: {
        isIn: [Object.values(TYPE)]
      }
    },
    firstName: {
      type: Sequelize.STRING(100),
      allowNull: false
    },
    lastName: {
      type: Sequelize.STRING(100),
      allowNull: false
    },
    /** Contact email */
    email: {
      type: Sequelize.STRING(100),
      allowNull: false,
      validate: {
        isEmail: true
      }
    },
    /** Contact phone number */
    phone: {
      allowNull: true,
      type: Sequelize.STRING(20)
    },
    mobile: {
      allowNull: true,
      type: Sequelize.STRING(20)
    },
    department: {
      allowNull: true,
      type: Sequelize.STRING(100),
      validate: {
        isIn: [Object.values(DEPARTMENT)]
      }
    },
    fax: {
      allowNull: true,
      type: Sequelize.STRING(20)
    },
    /** Boolean which tells a user exists in BNP for this contact */
    isLinkedToUser: {
      allowNull: true,
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    changedBy: {
      allowNull: true,
      type: Sequelize.STRING(60)
    },
    createdBy: {
      allowNull: true,
      type: Sequelize.STRING(60)
    },
    createdOn: {
      allowNull: false,
      type: Sequelize.DATE
    },
    changedOn: {
      allowNull: true,
      type: Sequelize.DATE
    }
  }, {
    updatedAt: 'changedOn',
    createdAt: 'createdOn',
    timestamps: true,
    freezeTableName: true,
    tableName: 'BusinessPartnerContact'
  });

  return Promise.resolve();
};
