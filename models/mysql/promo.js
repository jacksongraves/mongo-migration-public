'use strict';
module.exports = (sequelize, DataTypes) => {
  const Promo = sequelize.define('Promo', {
    name: DataTypes.STRING,
    percentage: DataTypes.INTEGER,
    startDate: DataTypes.DATE,
    endDate: DataTypes.DATE,
    maxUse: DataTypes.INTEGER,
    createdBy: DataTypes.STRING,
    status: DataTypes.STRING,
    country: DataTypes.STRING
  }, {});
  Promo.associate = function(models) {
    // associations can be defined here
  };
  return Promo;
};