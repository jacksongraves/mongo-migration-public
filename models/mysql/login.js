'use strict';
module.exports = (sequelize, DataTypes) => {
  const Login = sequelize.define('Login', {
    status: DataTypes.STRING,
    userName: DataTypes.STRING,
    appName: DataTypes.STRING,
    appVersion: DataTypes.STRING,
    brand: DataTypes.STRING,
    bundleId: DataTypes.STRING,
    buildNumber: DataTypes.STRING,
    buildType: DataTypes.STRING,
    bundleVersion: DataTypes.STRING,
    carrier: DataTypes.STRING,
    deviceId: DataTypes.STRING,
    deviceName: DataTypes.STRING,
    systemName: DataTypes.STRING,
    systemVersion: DataTypes.STRING,
    uniqueId: DataTypes.STRING,
    isEmulator: DataTypes.BOOLEAN,
    host: DataTypes.STRING,
    country: DataTypes.STRING,

  }, {});
  Login.associate = function(models) {
    // associations can be defined here
  };
  return Login;
};
