const mySQL = require("../../models/mysql");
const { VFS, SKU } = require("../../models/mongodb");
const { uploadFile } = require("../../models/mongodb");
// NOTE Not intended to be used as a server endpoint...
const loadAllEpubs = async () => {
	// Get all the mySQL Donation records
	await mySQL.VFS?.findAll({ raw: true })
		.then((allVFS) => {
			console.log(`Successfully retrieved VFS from MySQL`);

			// Iterate through all Donations since we need to specify logic on a per Donation basis
			const promises = [];

			// For debugging, only attempt to load the first file
			// promises.push(
			// 	loadVFS(allVFS[0])
			// 		.then((savedVFS) => console.log(`Saved VFS ${savedVFS._id}`))
			// 		.catch((error) => {
			// 			console.error(`Error loading VFS ${allVFS[0].id} to MongoDB`);
			// 			console.error(error.message);
			// 		})
			// );
			allVFS.forEach((mysqlVFS) =>
				// Attempt to load the Donation into MongoDB
				promises.push(
					loadVFS(mysqlVFS)
						.then((savedVFS) => console.log(`Saved VFS ${savedVFS._id}`))
						.catch((error) => {
							console.error(`Error loading VFS ${mysqlVFS.id} to MongoDB`);
							console.error(error.message);
						})
				)
			);
			return Promise.all(promises);
		})
		.catch((error) => {
			console.error(`Error retrieving VFS from MySQL`);
			console.error(error.message);
		});
};

/**
 * @function loadVFS
 * @description Asynchronously loads a MySQL VFS to MongoDB. Does require blocking in order to grab the appropriate references.
 * @param {Sequelize} mysqlDonation
 * @returns {MongoDBDonation}
 */
const loadVFS = async (mysqlVFS) => {
	// Unwrap the mySQL instance of the Donation
	const {
		// data: DataTypes.BLOB

		id: _mysqlId,
		filename,
		type,
		version,
		description,
		size,
		sku: _skuId,
		env,
		buildMode,
		buildType,
		releasedAt,
		data,
	} = mysqlVFS;

	// Template the mongoDB instance of the Donation
	const templateVFS = {
		_mysqlId,
		// _skuObjectID,
		// _gridFSObjectID,
		filename,
		type,
		version,
		description,
		size,
		// _skuId,
		env,
		buildMode,
		buildType,
		releasedAt,
		// data,
	};

	// Attempt to upload the file separately to GridFS
	const uploaded = await uploadFile(data, filename);

	// If the file was uploaded successfully, inject its id
	if (uploaded) templateVFS._gridFSObjectID = uploaded._id.toString();

	// Attempt to locate the SKU
	const sku = _skuId && (await SKU.findOne({ _skuId }).lean());

	// If the SKU exists, inject its id
	if (sku) templateVFS._skuObjectID = sku._id.toString();

	// Having completed the mongoDB VFS template, attempt to create it and save it
	const mongodbVFS = new VFS(templateVFS);

	const savedVFS = await mongodbVFS.save();

	return savedVFS;
};

module.exports = {
	loadAllEpubs,
};
