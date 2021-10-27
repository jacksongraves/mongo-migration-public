'use strict';
module.exports = (sequelize, DataTypes) => {
  const Version = sequelize.define('Version', {
    appVersion: DataTypes.STRING,
    bundleVersion: DataTypes.STRING,
    systemName: DataTypes.STRING,
    buildType: DataTypes.STRING,
    releasedAt: DataTypes.DATE,
    status: DataTypes.STRING,
    message: DataTypes.STRING,
  }, {});
  Version.associate = function(models) {
    // associations can be defined here
  };
  return Version;
};
