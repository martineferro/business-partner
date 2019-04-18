'use strict';
const Sequelize = require('sequelize');
const { TENANTID } = require('@opuscapita/field-validators');

module.exports.init = function(db, config) {
  /**
   * Tenant - organization that provides Products to buyers.
   * @class Tenant
   */
  let Tenant = db.define('Tenant',
  /** @lends Tenant */
  {
    /** Unique identifier. It is generated based on name field by stripping spaces and invalid special chars and if required, a number is appended for uniqueness, e.g. OpusCapita Software GmbH -> OpuscapitaSoftwareGmbh */
    id: {
      type: Sequelize.STRING(30),
      primaryKey: true,
      allowNull: false,
      validate: {
        isValid(value) {
          if (TENANTID.isInvalid(value))
            throw new Error(
              'ID is invalid. Only characters, hyphens, underscore and numbers are allowed.May not \
              start with number, hyphen or underscore. May not end with hyphen or underscore.');
        }
      }
    },
    /** ID represented in sales. */
    salesForceId: {
      allowNull: true,
      type: Sequelize.STRING(30)
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
  },
  {
    updatedAt: 'changedOn',
    createdAt: 'createdOn',
    timestamps: true,
    freezeTableName: true,
    tableName: 'Tenant'
  });

  return Promise.resolve();
};
