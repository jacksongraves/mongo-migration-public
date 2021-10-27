const {
	Library,
	Customer,
	Donation,
	Gift,
	Login,
	Log,
	Promo,
	Response,
	Version,
	SKU,
	VFS,
} = require("../../models/mongodb");

/**
 * USE CASE QUERIES
 * * How many books does Bill have?
 * * How many logs per user?
 * * Triage pre-defined
 * * Regex searches
 *   * Note: these should be available "out of the box" with `mongoose`.
 * * Order visualization: what should this look like?
 */

/**
 * @function getCustomer
 * @description Query a user (customer) by email, Mongo _id, or name. Returns the customer if found, else null.
 * @param {Object} args
 * @param {Object<String>}  args.email
 * @param {Object<String>}  args._id
 * @param {Object<String>}  args.name
 * @returns a Customer object, or null if not found
 */
const getCustomer = ({ email, _id, name }) => {
	let customer = null;

	if (_id && !customer) {
		customer = await Customer.findById(_id);
	}

	if (email && !customer) {
		customer = await Customer.findOne({ email });
	}

	if (name && !customer) {
		const firstNames = [name, name.split(" ")[0]];
		const lastNames = [name, name.split(" ")[1]];

		customer = await Customer.findOne({
			$or: [
				{ firstName: { $in: firstNames } },
				{ lastName: { $in: lastNames } },
			],
		});
	}

	if (!customer) {
		console.log("Customer not found");
	}

	return customer;
};

/**
 * TODO case insensitivity
 * @function deepLoadCustomer
 * @description Takes in a customer and if the customer exists (is not null),  attempts to flatten it with any associated metadata, e.g., the associated library, gifts, donations, promos used, etc. This is not strongly typed, and does NOT abide by the MongoDB schema for the user; it essentially spreads & polyfills the additional fields as arrays or nested objects. Fields will be filtered / searched as OR clauses in sequence if defined.
 * @param {Object|null} customer
 * @returns A flattened customer object with `donations`, `giftsGiven`, `giftsReceived`, `library`, `responses`, `logins`, and `logs` added, else null.
 */
const deepLoadCustomer = (customer) => {
	if (customer) {
		// Populate the customer by finding any associated fields
		const giftsGiven = await Gift.find({ _giverObjectID: customer._id });

		const giftsReceived = await Gift.find({
			$or: [
				{ _recipientObjectID: customer._id },
				{ recipientEmail: customer.email },
			],
		});

		const donations = await Donation.find({ _customerObjectID: customer._id });

		// NOTE: Not yet ready for this field
		// const orders = [];

		const library = await Library.find({
			$or: [
				{ _customerObjectID: customer._id },
				{ ownerEmail: customer.email },
			],
		});

		const responses = await Response.find({ _customerObjectID: customer._id });

		const logins = await Login.find({
			$or: [
				{
					userName: {
						$in: [
							customer.firstName,
							customer.lastName,
							customer.email,
							customer.userName,
						],
					},
				},
				{ _customerObjectID: customer._id },
			],
		});

		const logs = await Log.find({
			$or: [
				{
					userName: {
						$in: [
							customer.firstName,
							customer.lastName,
							customer.email,
							customer.userName,
						],
					},
				},
				{ _customerObjectID: customer._id },
			],
		});

		return {
			...customer,
			giftsGiven,
			giftsReceived,
			donations,
			library,
			responses,
			logins,
			logs,
		};
	} else {
		return null;
	}
};

// TODO
const deepLoadAllCustomers = () => {};

module.exports = {
	getCustomer,
	deepLoadCustomer,
	deepLoadAllCustomers,
};
