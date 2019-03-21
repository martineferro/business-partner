'use strict';
const Sequelize = require('sequelize');

const STATUS = { INVITED: 'invited', CONNECTED: 'connected', REJECTED: 'rejected' };

module.exports.STATUS = STATUS;

module.exports.init = function(db) {
  /**
   * BusinessLink.
   * @class BusinessLink
   */
  let BusinessLink = db.define('BusinessLink',
  /** @lends BusinessLink */
  {
    /** Unique identifier */
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    /** supplier id in Business Network */
    supplierId: {
      type: Sequelize.STRING(30),
      allowNull: false
    },
    /** customer id in Business Network */
    customerId: {
      type: Sequelize.STRING(30),
      allowNull: false
    },
    /** supplierId in Customer system */
    customerSupplierId: {
      type: Sequelize.STRING(50),
      allowNull: true
    },
    /** status of business link. Can be invited, connected or rejected */
    status: {
      type: Sequelize.STRING(50),
      allowNull: false,
      validate: {
        isIn: [Object.values(STATUS)]
      }
    },
    createdBy: {
      allowNull : false,
      type: Sequelize.STRING(60)
    },
    changedBy: {
      allowNull : true,
      type: Sequelize.STRING(60),
    },
    createdOn: {
      type: Sequelize.DATE,
      allowNull: false
    },
    changedOn: {
      type: Sequelize.DATE,
      allowNull: true
    }
  }, {
    updatedAt: 'changedOn',
    createdAt: 'createdOn',
    timestamps: true,
    freezeTableName: true,
    tableName: 'BusinessLink'
  });

  return Promise.resolve();
};
