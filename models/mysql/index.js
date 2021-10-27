"use strict";

const fs = require("fs");
const path = require("path");
const { Sequelize, DataTypes } = require("sequelize");
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
// const config = require(__dirname + "/../config/config.json")[env];
const db = {};

// console.log(process.env.MYSQL_DB);
const sequelize = new Sequelize(
	process.env.MYSQL_DB,
	process.env.MYSQL_UN,
	process.env.MYSQL_PW,
	{
		dialect: process.env.MYSQL_DIALECT,
		host: process.env.MYSQL_HOST,
		port: process.env.MYSQL_PORT,
		omitNull: true,
		logging: false,
	}
);

fs.readdirSync(__dirname)
	.filter(
		(file) =>
			file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
	)
	.forEach((file) => {
		const model = require(path.join(__dirname, file))(sequelize, DataTypes);
		db[model.name] = model;
	});

Object.keys(db).forEach((modelName) => {
	if (db[modelName].associate) {
		db[modelName].associate(db);
	}
});

sequelize
	.authenticate()
	.then(() => {
		console.log("Connection has been established successfully.");
	})
	.catch((error) => {
		console.error("Unable to connect to the database:", error);
	});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
