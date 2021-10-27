const mySQL = require("../../models/mysql");
const { Donation } = require("../../models/mongodb");
const { Customer } = require("../../models/mongodb");
const { SKU } = require("../../models/mongodb");

// NOTE Not intended to be used as a server endpoint...
const loadAllDonations = async () => {
	// Get all the mySQL Donation records
	await mySQL.Donation?.findAll({ raw: true })
		.then((allDonations) => {
			console.log(`Successfully retrieved Donations from MySQL`);

			// Iterate through all Donations since we need to specify logic on a per Donation basis
			const promises = [];

			allDonations.forEach((mysqlDonation) =>
				// Attempt to load the Donation into MongoDB
				promises.push(
					loadDonation(mysqlDonation)
						.then((savedDonation) =>
							console.log(`Saved Donation ${savedDonation._id}`)
						)
						.catch((error) => {
							console.error(
								`Error loading Donation ${mysqlDonation.id} to MongoDB`
							);
							console.error(error.message);
						})
				)
			);
			return Promise.all(promises);
		})
		.catch((error) => {
			console.error(`Error retrieving Donations from MySQL`);
			console.error(error.message);
		});
};

/**
 * @function loadDonation
 * @description Asynchronously loads a MySQL Donation to MongoDB. Upstream dependencies on Customer (for a giver and optional recipient), SKU, and potentially a Order (future work). Does require blocking in order to grab the appropriate references.
 * @param {Sequelize} mysqlDonation
 * @returns {MongoDBDonation}
 */
const loadDonation = async (mysqlDonation) => {
	// Unwrap the mySQL instance of the Donation
	const {
		id,
		user,
		amount,
		currency,
		recurring,
		orderId,
		item,
		sku: _skuId,
	} = mysqlDonation;

	// Template the mongoDB instance of the Donation
	const templateDonation = {
		_mysqlId: id,
		// user, // required field
		amount,
		currency, // required for dependent field
		recurring,
		// orderId, // dependent
		item,
		// sku: _skuId, // dependent field
	};

	// Attempt to locate the giver
	const customer = user && (await Customer.findOne({ email: user }).lean());

	// If the giver exists, inject its id
	if (customer) templateDonation._customerObjectID = customer._id.toString();

	/**
	 * TODO Attempt to locate an orderId if we set up an external table for them
	 * For now, simply manually apply the `orderId`
	 * @example
	 * const order = (orderId) && await Order.findOne({ id: orderId }.lean());
	 * if (order) templateDonation._orderObjectID = order._id.toString();
	 */
	if (orderId) templateDonation.orderId = orderId;

	// Attempt to locate the SKU
	const sku = _skuId && (await SKU.findOne({ _skuId }).lean());

	// If the SKU exists, inject its id
	if (sku) templateDonation._skuObjectID = sku._id.toString();

	// Having completed the mongoDB Donation template, attempt to create it and save it
	const mongodbDonation = new Donation(templateDonation);

	const savedDonation = await mongodbDonation.save();

	return savedDonation;
};

module.exports = {
	loadAllDonations,
};
