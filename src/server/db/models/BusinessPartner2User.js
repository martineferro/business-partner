'use strict';
const Sequelize = require('sequelize');

const STATUS = { REQUESTED: 'requested', APPROVED: 'approved', REJECTED: 'rejected' };

module.exports.STATUS = STATUS;

module.exports.init = function(db, config) {
  /**
   * BusinessPartner2User. This class is used to manage user access to businessPartner workflow
   * @class BusinessPartner2User
   */
  let BusinessPartner2User = db.define('BusinessPartner2User',
  /** @lends BusinessPartner2User */
  {
    /** Unique identifier */
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    /** businessPartner Id of the businessPartner the user wants access to */
    businessPartnerId: {
      type: Sequelize.STRING(30),
      allowNull: false
    },
    /** user Id of the user requesting access to businessPartner */
    userId: {
      type: Sequelize.STRING(100),
      allowNull: false
    },
    /** status of the access request. It can be requested, approved, or rejected */
    status: {
      type: Sequelize.STRING(50),
      allowNull: false,
      defaultValue: STATUS.REQUESTED,
      validate: {
        isIn: [Object.values(STATUS)]
      }
    },
    /** reason why the user wants access to the businessPartner */
    accessReason: {
      type: Sequelize.STRING(1000),
      allowNull: true
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
    tableName: 'BusinessPartner2User'
  });

  return Promise.resolve();
};
