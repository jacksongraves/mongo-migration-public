// Import the mongoose Schema for the Order collection
const getJSON = require("../../utils/getJSON");
const { VFS, SKU, uploadFile, getFileById } = require("../../models/mongodb");
const chalk = require("chalk");
const fs = require("fs");
const path = require("path");

// NOTE Not intended to be used as a server endpoint...
const loadAllSKUs = async (filepath, filename) => {
	// Get all the JSON SKU records
	return getJSON(filepath, filename)
		.then((json) => {
			const jsonSKUs = json.skus;
			console.log(`Successfully retrieved SKUs from JSON`);

			// Iterate through all books since we need to specify logic on a per book basis
			const promises = [];

			jsonSKUs.forEach((jsonSKU) =>
				// Attempt to load the book into MongoDB
				promises.push(
					loadSKU(jsonSKU)
						.then((savedSKU) => console.log(`Saved SKU ${savedSKU._id}`))
						.catch((error) => {
							console.error(`Error loading SKU ${jsonSKU.id} to MongoDB`);
							console.error(error.message);
						})
				)
			);

			return Promise.all(promises);
		})
		.then(async (data) => {
			const skusJSON = await SKU.find({}).lean();
			const skusString = JSON.stringify(skusJSON);

			const skusBuffer = Buffer.from(skusString, "utf-8");

			// Attempt to upload the file separately to GridFS
			const uploaded = await uploadFile(skusBuffer, "skus.json");

			// If the file was uploaded successfully, inject its id
			if (uploaded) {
				console.log(
					chalk.redBright("HEADS UP!!!") +
						" Save the " +
						chalk.greenBright(`ObjectID(${uploaded._id})`) +
						"somewhere safe, we need it for online downloaded / differencing the skus.json file"
				);

				// Redownload the file for exporting
				const downloaded = await getFileById(uploaded._id);

				// Write an .env file for posterity, to ensure we can access the skus.json ObjectID later
				fs.writeFileSync(
					path.join(process.cwd(), "skus.env"),
					`APP_VERSION_NUMBER = ${
						process.env.APP_VERSON_NUMBER || "0.0.0"
					}\nSKUS_JSON_OBJECT_ID = ${uploaded._id.toString()}`
				);

				// Write the JSON export, this replicates what will be saved offline.
				fs.writeFileSync(
					path.join(process.cwd(), "skus-mongo.json"),
					downloaded
				);

				return uploaded._id;
			} else {
				throw Error("Failed to upload skus.json");
			}
		})
		.catch((error) => {
			console.error(`Error retrieving SKUs from JSON`);
			console.error(error.message);
		});
};

/**
 * Saves a single SKU object to MongoDB
 * @param {*} jsonSKU
 * @returns {Model} SKU
 */
const loadSKU = async (jsonSKU) => {
	// Template the mongoDB instance of the SKU
	// Since ALL fields will be pulled as-is from JSON, and SKU is a parent / master table, we can simply spread the jsonSKU
	const templateSKU = {
		...jsonSKU,
		_skuId: jsonSKU.id,
	};

	// No child / referenced fields are required for this SKU, so create and save it as-is
	const mongodbSKU = new SKU(templateSKU);

	// Attempt to save the SKU
	const savedSKU = await mongodbSKU.save();

	return savedSKU;
};

module.exports = {
	loadAllSKUs,
};
