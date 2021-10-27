const mySQL = require("../../models/mysql");
const { Customer } = require("../../models/mongodb/customerModel");
const { Gift } = require("../../models/mongodb/giftModel");
const { SKU } = require("../../models/mongodb/skuModel");

// NOTE Not intended to be used as a server endpoint...
const loadAllGifts = async () => {
	// Get all the mySQL Gift records
	await mySQL.Gift?.findAll({ raw: true })
		.then((allGifts) => {
			console.log(`Successfully retrieved Gifts from MySQL`);

			// Iterate through all Gifts since we need to specify logic on a per Gift basis
			const promises = [];
			allGifts.forEach((mysqlGift) =>
				// Attempt to load the Gift into MongoDB
				promises.push(
					loadGift(mysqlGift)
						.then((savedGift) => console.log(`Saved Gift ${savedGift._id}`))
						.catch((error) => {
							console.error(`Error loading Gift ${mysqlGift.id} to MongoDB`);
							console.error(error.message);
						})
				)
			);
			return Promise.all(promises);
		})
		.catch((error) => {
			console.error(`Error retrieving Gifts from MySQL`);
			console.error(error.message);
		});
};

/**
 * @function loadGift
 * @description Asynchronously loads a MySQL Gift to MongoDB. Upstream dependencies on Customer (for a giver and optional recipient), SKU, and potentially a Order (future work). Does require blocking in order to grab the appropriate references.
 * @param {Sequelize} mysqlGift
 * @returns {MongoDBGift}
 */
const loadGift = async (mysqlGift) => {
	// Unwrap the mySQL instance of the Gift
	const {
		id,
		status,
		recipientName,
		recipientEmail,
		giverName,
		giverEmail,
		sentAt,
		receivedAt,
		orderId,
		item,
		sku: _skuId,
		source,
	} = mysqlGift;

	// Template the mongoDB instance of the Gift
	const templateGift = {
		_mysqlId: id,
		status,
		recipientName,
		recipientEmail, // required for dependent field
		giverName,
		giverEmail, // required for optional dependent field
		sentAt,
		receivedAt,
		// orderId, // dependent
		item,
		// sku: skuCode, // dependent field
		source,
	};

	// Attempt to locate the giver
	const giver =
		giverEmail && (await Customer.findOne({ email: giverEmail }).lean());

	// If the giver exists, inject its id
	if (giver) templateGift._giverObjectID = giver._id.toString();

	// Attempt to locate the recipient
	const recipient =
		recipientEmail &&
		(await Customer.findOne({ email: recipientEmail }).lean());

	// If the recipient exists, inject its id
	if (recipient) templateGift._recipientObjectID = recipient._id.toString();

	/**
	 * TODO Attempt to locate an orderId if we set up an external table for them
	 * For now, simply manually apply the `orderId`
	 * @example
	 * const order = (orderId) && (await Order.findOne({ id: orderId }).lean());
	 * if (order) templateGift._orderObjectID = order._id.toString();
	 */
	if (orderId) templateGift.orderId = orderId;

	// Attempt to locate the SKU
	const sku = _skuId && (await SKU.findOne({ _skuId }).lean());

	// If the SKU exists, inject its id
	if (sku) templateGift._skuObjectID = sku._id.toString();

	// Having completed the mongoDB Gift template, attempt to create it and save it
	const mongodbGift = new Gift(templateGift);

	const savedGift = await mongodbGift.save();

	return savedGift;
};

module.exports = {
	loadAllGifts,
};
