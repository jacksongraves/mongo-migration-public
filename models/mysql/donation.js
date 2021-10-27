'use strict';
module.exports = (sequelize, DataTypes) => {
  const Donation = sequelize.define('Donation', {
    user: DataTypes.STRING,
    amount: DataTypes.INTEGER,
    currency: DataTypes.STRING,
    recurring: DataTypes.STRING,
    orderId: DataTypes.STRING,
    item: DataTypes.STRING,
    sku: DataTypes.STRING,
  }, {});
  Donation.associate = function(models) {
    // associations can be defined here
  };
  return Donation;
};
