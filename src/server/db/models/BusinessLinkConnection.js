'use strict';
const Sequelize = require('sequelize');
const BusinessLink = require('./BusinessLink');

const TYPE = { INVOICE: 'invoice', ORDER: 'order', CATALOG: 'catalog', GOODS: 'goods', RFQ: 'rfq' };

module.exports.TYPE = TYPE;

module.exports.init = function(db) {
  /**
   * BusinessLinkConnection.
   * @class BusinessLinkConnection
   */
  let BusinessLinkConnection = db.define('BusinessLinkConnection',
  /** @lends BusinessLinkConnection */
  {
    /** Unique identifier */
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    /** Associated business link id */
    businessLinkId: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    /** Type of connection. E.g. invoice, catalog */
    type: {
      type: Sequelize.STRING(50),
      allowNull: false,
      validate: {
        isIn: [Object.values(TYPE)]
      }
    },
    /** status of business link connection. Can be invited, connected or rejected */
    status: {
      type: Sequelize.STRING(50),
      allowNull: false,
      validate: {
        isIn: [Object.values(BusinessLink.STATUS)]
      }
    },
    /** Additional config parameters for the types of connections. Usefull only for types invoice and order */
    config: {
      type: Sequelize.JSON,
      allowNull: true
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
    tableName: 'BusinessLinkConnection'
  });

  return Promise.resolve();
};
