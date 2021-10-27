// @config
const dotenv = require("dotenv");
dotenv.config();

// @cli
const colors = require("colors");
const chalk = require("chalk");

// @models: This statement initializes the database
const mongoDBModels = require("./models/mongodb");
const mySQLModels = require("./models/mysql");

// @schemas
const {
	Customer,
	Library,
	Gift,
	SKU,
	Donation,
	Log,
	Login,
	Promo,
	GridFSFiles,
	GridFSChunks,
} = require("./models/mongodb");

/**
 * @function asyncDeleter
 * @description Asynchronously runs `<model>.deleteMany()` on all MongoDB collections, including `GridFS`, sanitizing the database. Only run in `development`.
 * @returns
 */
const asyncDeleter = async () => {
	// All collections will be dropped.
	console.log(chalk.redBright("WARNING!!!"));
	console.log(
		chalk.redBright(
			"All collections will be emptied from the MongoDB instance."
		)
	);

	// Asynchronously delete all collection documents in paralle.
	const deleting = await Promise.all([
		Promo.deleteMany(),
		Login.deleteMany(),
		Log.deleteMany(),
		Customer.deleteMany(),
		Library.deleteMany(),
		Gift.deleteMany(),
		SKU.deleteMany(),
		Donation.deleteMany(),
		GridFSFiles.deleteMany(),
		GridFSChunks.deleteMany(),
	])
		.then(async (res) => {
			console.log("All collections deleted.");
			return;
		})
		.catch((err) => {
			console.log("Error deleting collections.");
			console.log(err);
		});

	return deleting;
};

module.exports = asyncDeleter;
