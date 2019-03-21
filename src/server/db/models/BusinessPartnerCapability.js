'use strict';
const Sequelize = require('sequelize');

const TYPE = {
  INVOICE_SEND: 'eInvoice-send',
  ORDER: 'order',
  CATALOG: 'catalog',
  FULFILLMENT: 'fulfillment'
};

module.exports.TYPE = TYPE;

module.exports.init = function(db, config) {
  /**
   * BusinessPartnerCapability.
   * @class BusinessPartnerCapability
   */
  let BusinessPartnerCapability = db.define('BusinessPartnerCapability',
  /** @lends BusinessPartnerCapability */
  {
    /** Unique identifier */
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    businessPartnerId: {
      type: Sequelize.STRING(30),
      allowNull: false
    },
    capabilityId: {
      type: Sequelize.STRING(50),
      allowNull: false,
      validate: {
        isIn: [Object.values(TYPE)]
      }
    },
    createdBy: {
      type: Sequelize.STRING(60),
      allowNull: false
    },
    changedBy: {
      type: Sequelize.STRING(60),
      allowNull: true
    },
    createdOn: {
      type: Sequelize.DATE(),
      allowNull: false
    },
    changedOn: {
      type: Sequelize.DATE(),
      allowNull: false
    }
  }, {
    updatedAt: 'changedOn',
    createdAt: 'createdOn',
    timestamps: true,
    freezeTableName: true,
    tableName: 'BusinessPartnerCapability'
  });

  return Promise.resolve();
};
