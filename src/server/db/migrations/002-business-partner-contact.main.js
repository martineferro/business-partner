const Sequelize = require("sequelize");

module.exports.up = async function (db, config)
{
  return db.queryInterface.createTable('BusinessPartnerContact', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    businessPartnerId: {
      type: Sequelize.STRING(30),
      allowNull: false
    },
    title: {
      allowNull: true,
      type: Sequelize.STRING(20)
    },
    type: {
      allowNull: true,
      type: Sequelize.STRING(35)
    },
    firstName: {
      type: Sequelize.STRING(100),
      allowNull: false
    },
    lastName: {
      type: Sequelize.STRING(100),
      allowNull: false
    },
    email: {
      type: Sequelize.STRING(100),
      allowNull: false
    },
    phone: {
      type: Sequelize.STRING(20),
      allowNull: true
    },
    mobile: {
      allowNull: true,
      type: Sequelize.STRING(20)
    },
    department: {
      allowNull: true,
      type: Sequelize.STRING(100)
    },
    fax: {
      allowNull: true,
      type: Sequelize.STRING(20)
    },
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
      allowNull: false,
      type: Sequelize.STRING(60)
    },
    createdOn: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW
    },
    changedOn: {
      allowNull: true,
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW
    }
  });
};

module.exports.down = async function(db, config)
{
  return db.queryInterface.dropTable('BusinessPartnerContact');
};
