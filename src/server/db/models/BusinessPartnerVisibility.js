'use strict';
const Sequelize = require('sequelize');

const TYPE = { PUBLIC: 'public', PRIVATE: 'private', BUSINESS_PARTNERS: 'businessPartners' };

module.exports.TYPE = TYPE;

module.exports.init = function(db, config) {
  /**
   * BusinessPartnerVisibility.
   * @class BusinessPartnerVisibility
   */
  let BusinessPartnerVisibility = db.define('BusinessPartnerVisibility',
  /** @lends BusinessPartnerVisibility */
  {
    /** Unique identifier */
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    businessPartnerId: {
      type: Sequelize.STRING(30),
      allowNull: false
    },
    contacts: {
      type: Sequelize.STRING(50),
      allowNull: false,
      defaultValue: TYPE.PRIVATE,
      validate: {
        isIn: [Object.values(TYPE)]
      }
    },
    bankAccounts: {
      type: Sequelize.STRING(50),
      allowNull: false,
      defaultValue: TYPE.PRIVATE,
      validate: {
        isIn: [Object.values(TYPE)]
      }
    },
    createdBy: {
      allowNull: false,
      type: Sequelize.STRING(60)
    },
    changedBy: {
      allowNull: true,
      type: Sequelize.STRING(60)
    },
    createdOn: {
      type: Sequelize.DATE(),
      allowNull: false
    },
    changedOn: {
      type: Sequelize.DATE(),
      allowNull: true
    }
  }, {
    updatedAt: 'changedOn',
    createdAt: 'createdOn',
    timestamps: true,
    freezeTableName: true,
    tableName: 'BusinessPartnerVisibility'
  });

  return Promise.resolve();
};
