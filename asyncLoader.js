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
	console.log(chalk.greenBright("Preparing to load the MongoDB instance."));
	console.log("Preparing to load independent tables");
	await conn;
	const loading = Promise.all([
		loaders.independent.loadAllSKUs("data", "skus"),
		loaders.independent.loadAllCustomers(),
		loaders.independent.loadAllPromos(),
		loaders.independent.loadAllLogins(),
		loaders.independent.loadAllLogs(),
	])
		.then((res) => {
			console.log("Independent MySQL tables loaded to MongoDB");
			console.log("Now loading first set of dependent MySQL tables to MongoDB");

			// Books in the library are heavily interrelated and have many upstream dependencies and thus should be loaded towards the end.
			const dependents = Promise.all([
				loaders.dependent.loadAllEpubs(),
				loaders.dependent.loadAllGifts(),
				loaders.dependent.loadAllDonations(),
			]);

			return dependents;
		})
		.then((res) => {
			console.log("First set of dependent MySQL tables loaded to MongoDB");
			console.log(
				"Now loading second set of dependent MySQL tables to MongoDB"
			);
			return loaders.dependent.loadAllBooksToLibrary();
		});

	return loading;
};

module.exports = asyncLoader;
