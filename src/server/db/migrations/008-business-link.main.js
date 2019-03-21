const Sequelize = require('sequelize');

module.exports.up = async function(db, config)
{
  return Promise.all([
    db.queryInterface.createTable('BusinessLink', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      supplierId: {
        type: Sequelize.STRING(30),
        allowNull: false
      },
      customerId: {
        type: Sequelize.STRING(30),
        allowNull: false
      },
      customerSupplierId: {
        type: Sequelize.STRING(50),
        allowNull: true
      },
      status: {
        type: Sequelize.STRING(50),
        allowNull: false
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
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      changedOn: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: Sequelize.NOW
      }
    }),
    db.queryInterface.createTable('BusinessLinkConnection', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      businessLinkId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      type: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      status: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
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
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      changedOn: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: Sequelize.NOW
      }
    }),
  ]);
}

module.exports.down = async function(db, config)
{
  return Promise.all([
    db.queryInterface.dropTable('BusinessLink'),
    db.queryInterface.dropTable('BusinessLinkConnection'),
  ]);
}
