'use strict';
module.exports = (sequelize, DataTypes) => {
  const VFS = sequelize.define('VFS', {
    filename: DataTypes.STRING,
    type: DataTypes.STRING,
    version: DataTypes.STRING,
    description: DataTypes.STRING,
    size: DataTypes.INTEGER,
    sku: DataTypes.STRING,
    env: DataTypes.STRING,
    buildMode: DataTypes.STRING,
    buildType: DataTypes.STRING,
    releasedAt: DataTypes.DATE,
    // data: DataTypes.BLOB
    data: {
      type: DataTypes.BLOB('long'),
    }
  }, {});
  VFS.associate = function(models) {
    // associations can be defined here
  };
  return VFS;
};
