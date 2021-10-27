'use strict';
module.exports = (sequelize, DataTypes) => {
  const Book = sequelize.define('Book', {
    status: DataTypes.STRING,
    ownerEmail: DataTypes.STRING,
    readAt: DataTypes.DATE,
    giftId: DataTypes.STRING,
    orderId: DataTypes.STRING,
    item: DataTypes.STRING,
    bookName: DataTypes.STRING,
    sku: DataTypes.STRING,
    source: DataTypes.STRING,

  }, {});
  Book.associate = function(models) {
    // associations can be defined here
  };
  return Book;
};
