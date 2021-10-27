'use strict';
module.exports = (sequelize, DataTypes) => {
  const PromoHist = sequelize.define('PromoHist', {
    name: DataTypes.STRING,
    user: DataTypes.STRING,
    orderId: DataTypes.STRING,
    orderAmount: DataTypes.INTEGER,
    discountAmount: DataTypes.INTEGER,
    currency: DataTypes.STRING,
    country: DataTypes.STRING
  }, {});
  PromoHist.associate = function(models) {
    // associations can be defined here
  };
  return PromoHist;
};