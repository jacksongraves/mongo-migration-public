'use strict';
module.exports = (sequelize, DataTypes) => {
  var Customer = sequelize.define(
    'Customer',
    {
      userName: DataTypes.STRING,
      password: DataTypes.STRING,
      salt: DataTypes.STRING,
        firstName: DataTypes.STRING,
        lastName: DataTypes.STRING,
        email: DataTypes.STRING,
      stripeCustomerId: DataTypes.STRING,
      defaultSourceId: DataTypes.STRING,
        status: DataTypes.STRING,
        passwordExpiresAt: DataTypes.DATE,
        roleUser: DataTypes.BOOLEAN,
        roleDev: DataTypes.BOOLEAN,
        roleAdmin: DataTypes.BOOLEAN,
        roleBeta: DataTypes.BOOLEAN,
        productPlan: DataTypes.STRING,
        country: DataTypes.STRING,
    },
    {}
  );
  Customer.associate = function(models) {
    // associations can be defined here
  };
  return Customer;
};
