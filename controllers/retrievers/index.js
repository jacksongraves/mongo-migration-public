const {
	Library,
	Customer,
	Donation,
	Gift,
	Login,
	Log,
	Promo,
	SKU,
	Response,
	VFS,
	GridFSFiles,
	GridFSChunks,
	getFileById,
} = require("../../models/mongodb");

const retrieveResponses = async () => {
	// Retrieve a list of all Donations, and populate the dependencies
	// TODO: update this if we ever switch to an order collection
	const responses = await Response.find({})
		.populate("_customerObjectID _skuObjectID")
		.lean();

	// No transformations are required, so return the responses as-is
	return responses;
};

const retrieveDonations = async (backwardsCompatible = false) => {
	// Retrieve a list of all Donations, and populate the dependencies
	// TODO: update this if we ever switch to an order collection
	const donations = await Donation.find({})
		.populate("_customerObjectID _skuObjectID")
		.lean();

	// Backwards compatibility ensures all fields in a given record match the original MySQL schema
	if (backwardsCompatible) {
		donations.map((donation) => {
			donation.sku = donation._skuObjectID._skuId;
			donation.user = donation._customerObjectID.email;
		});
	}

	// No transformations are required, so return the versions as-is
	return donations;
};

const retrieveGifts = async (backwardsCompatible = false) => {
	// Retrieve a list of all Gifts, and populate the dependencies
	// TODO: update this if we ever switch to an order collection
	const gifts = await Gift.find({})
		.populate("_giverObjectID _recipientObjectID _skuObjectID")
		.lean();

	// Backwards compatibility ensures all fields in a given record match the original MySQL schema
	if (backwardsCompatible) {
		gifts.map((gift) => {
			gift.sku = gift._skuObjectID._skuId;
			gift.giverName =
				gift._giverObjectID.firstName + " " + gift._giverObjectID.lastName;
			gift.giverEmail = gift._giverObjectID.email;
			if (gift._recipientObjectID) {
				gift.recipientName =
					gift._recipientObjectID.firstName +
					" " +
					gift._recipientObjectID.lastName;
				gift.recipientEmail = gift._recipientObjectID.email;
			}
		});
	}

	// No transformations are required, so return the Gifts as-is
	return gifts;
};

const retrieveLibraries = async (backwardsCompatible = false) => {
	// Retrieve a list of all Gifts, and populate the dependencies
	// TODO: update this if we ever switch to an order collection
	const libraries = await Library.find({})
		.populate("_giftObjectID _customerObjectID _skuObjectID")
		.lean();

	// Backwards compatibility ensures all fields in a given record match the original MySQL schema
	if (backwardsCompatible) {
		libraries.map((book) => {
			book.sku = book._skuObjectID._skuId;
			book.ownerEmail = book._customerObjectID.email;
			book.giftId = book._giftObjectID;
		});
	}

	// No transformations are required, so return the Libraries as-is
	return libraries;
};

const retrieveCustomers = async () => {
	// Retrieve a list of all Customers
	const customers = await Customer.find({}).lean();

	// No transformations are required, so return the Customers as-is, backwards compatible by definition
	return customers;
};

// FIXME
const retrieveLogs = async () => {
	// Retrieve a list of all Logs
	const logs = await Log.find({}).lean();

	// No transformations are required, so return the Logs as-is, backwards compatible by definition
	return logs;
};

// FIXME
const retrieveLogins = async () => {
	// Retrieve a list of all Logins
	const logins = await Login.find({}).lean();

	// No transformations are required, so return the Logins as-is, backwards compatible by definition
	return logins;
};

const retrievePromos = async () => {
	// Retrieve a list of all Promos
	const promos = await Promo.find({}).lean();

	// No transformations are required, so return the Promos as-is, backwards compatible by definition
	return promos;
};

const retrieveSKUs = async () => {
	// Retrieve a list of all SKUs
	const skus = await SKU.find({}).lean();

	// Wrap the skus in the appropriate JSON structure per the original skus.json file
	// This ensures backwards compatibility by default
	const jsonSKUs = {
		version: process.env.APP_VERSION_NUMBER,
		skus,
	};

	// Return the JSON as needed
	return jsonSKUs;
};

const retrieveVFSs = async (backwardsCompatible = false) => {
	// Retrieve a list of all VFS objects
	const allVFSs = await VFS.find({}).populate("_skuObjectID").lean();

	// Backwards compatibility ensures all fields in a given record match the original MySQL schema
	if (backwardsCompatible) {
		allVFSs.map((vfs) => {
			vfs.sku = vfs._skuObjectID._skuId;
		});
	}

	// No transformations are required, so return the VFSs as-is
	return allVFSs;
};

const retrieveEpubFromVFS = async (_id, backwardsCompatible = false) => {
	// Retrieve a list of all VFS objects
	const vfs = await VFS.findById(_id).populate("_skuObjectID").lean();

	if (vfs) {
		// Extract the gridFS ObjectID
		const { _gridFSObjectID } = vfs;

		// Grab the file as a blob from GridFS
		const data = await getFileById(_gridFSObjectID);

		// Inject the data dependency; nomenclature should be consistent
		if (data) {
			vfs.data = data;
		} else {
			vfs.data = "";
		}
	}

	// Backwards compatibility ensures all fields in a given record match the original MySQL schema
	if (backwardsCompatible) {
		vfs.sku = vfs._skuObjectID._skuId;
	}

	return vfs;
};

module.exports = {
	retrieveDonations,
	retrieveGifts,
	retrieveLibraries,
	retrieveLogins,
	retrieveLogs,
	retrievePromos,
	retrieveSKUs,
	retrieveCustomers,
	retrieveVFSs,
	retrieveEpubFromVFS,
	retrieveResponses,
};
