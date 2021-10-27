'use strict';
module.exports = (sequelize, DataTypes) => {
  const Gift = sequelize.define('Gift', {
    status: DataTypes.STRING,
    recipientName: DataTypes.STRING,
    recipientEmail: DataTypes.STRING,
    giverName: DataTypes.STRING,
    giverEmail: DataTypes.STRING,
    sentAt: DataTypes.DATE,
    receivedAt: DataTypes.DATE,
    orderId: DataTypes.STRING,
    item: DataTypes.STRING,
    sku: DataTypes.STRING,
    source: DataTypes.STRING,
  }, {});
  Gift.associate = function(models) {
    // associations can be defined here
  };
  return Gift;
};
