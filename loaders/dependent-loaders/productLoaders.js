// Import the mongoose Schema for the Order collection
const getJSON = require("../../utils/getJSON");
const { VFS, SKU, getFileById } = require("../../models/mongodb");
const { uploadFile } = require("../../models/mongodb");
const chalk = require("chalk");
const fs = require("fs");
const path = require("path");

// NOTE Not intended to be used as a server endpoint...
const loadProductsJSON = async (filepath, filename) => {
	// Get all the JSON SKU records
	return getJSON(filepath, filename)
		.then(async (json) => {
			const productsJSON = json;
			console.log(`Successfully retrieved products.json from JSON`);

			const productsString = JSON.stringify(productsJSON);

			const productsBuffer = Buffer.from(productsString, "utf-8");

			// Attempt to upload the file separately to GridFS
			const uploaded = await uploadFile(productsBuffer, "products.json");

			// If the file was uploaded successfully, inject its id
			if (uploaded) {
				console.log(
					chalk.redBright("HEADS UP!!!") +
						" Save the " +
						chalk.greenBright(`ObjectID(${uploaded._id})`) +
						"somewhere safe, we need it for online downloaded / differencing the products.json file"
				);

				// Redownload the file for exporting
				const downloaded = await getFileById(uploaded._id);

				// Write an .env file for posterity, to ensure we can access the products.json ObjectID later
				fs.writeFileSync(
					path.join(process.cwd(), "products.env"),
					`APP_VERSION_NUMBER = ${
						process.env.APP_VERSON_NUMBER || "0.0.0"
					}\nPRODUCTS_JSON_OBJECT_ID = ${uploaded._id.toString()}`
				);

				// Write the JSON export, this replicates what will be saved offline.
				fs.writeFileSync(
					path.join(process.cwd(), "products-mongo.json"),
					downloaded
				);

				return uploaded._id;
			} else {
				throw Error("Failed to upload products.json");
			}
		})
		.catch((error) => {
			console.error(`Error retrieving products.json from JSON`);
			console.error(error.message);
		});
};

module.exports = {
	loadProductsJSON,
};
