// @config
const dotenv = require("dotenv");
dotenv.config();

// @cli
const chalk = require("chalk");

// @models: This statement initializes the database
const mongoDBModels = require("./models/mongodb");
const mySQLModels = require("./models/mysql");

// @loaders
const { loaders } = require("./loaders");
const { conn } = require("./models/mongodb");

/**
 * @function asyncLoader
 * @description Asynchronously loads MySQL and JSON data into the MongoDB instance, in batches according to dependencies and related ObjectID references.
 */
const asyncLoader = async () => {
	// SKUs, Versions, Promos, Customers, Logins, and Logs have no upstream dependencies and can be loaded in the first "batch"
	console.log(
		chalk.greenBright("Preparing to load products to the MongoDB instance.")
	);
	await conn;

	const loading = await loaders.dependent.loadProductsJSON("data", "products");

	return loading;
};

module.exports = asyncLoader;
