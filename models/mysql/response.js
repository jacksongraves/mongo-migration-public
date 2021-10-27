'use strict';
module.exports = (sequelize, DataTypes) => {
  const Response = sequelize.define('Response', {
    user: DataTypes.STRING,
    sku: DataTypes.STRING,
    key: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: 'response.key is required'}
      },
    },
    response: {
      type: DataTypes.STRING,
    },
    deviceName: DataTypes.STRING,
    deviceUId: DataTypes.STRING,
    deviceAt: DataTypes.DATE
  }, {
    validate: {
      keyRequired() {
        console.log(this);
        if(!this.key || this.key === null || this.key === '') {
          throw new Error('response.key is required');
        }
      }
    }
  });
  Response.associate = function(models) {
    // associations can be defined here
  };
  return Response;
};
