/**
 * https://www.npmjs.com/package/mongoose
 * Mongoose is a MongoDB object modeling tool designed to work in an asynchronous environment. Mongoose supports both promises and callbacks.
 */
const mongoose = require("mongoose");

/**
 * customerSchema refers to a MongoDB Customer collection / document type.
 * TODO While standard practice in MySQL is to name tables in the plural, with MongoDB, we'll use a singular naming convention for the schema itself.
 */
const customerSchema = mongoose.Schema(
	{
		/**
		 * FIXME Number will take in an Int, but does not guarantee it casts properly.
		 * MongoDB uses an ObjectID uuid string instead, so this will ultimately be redundant.
		 */
		_mysqlId: {
			type: Number,
			required: true,
		},

		userName: {
			type: String,
			required: true,
		},

		firstName: {
			type: String,
		},

		lastName: {
			type: String,
		},

		email: {
			type: String,
			required: true,
		},

		/**
		 * NOTE we need to ensure that any migrations don't overwrite or re-hash the password field
		 */
		password: {
			type: String,
			required: true,
		},

		/**
		 * NOTE we need to ensure that any migrations don't overwrite or re-salt the salt field
		 */
		salt: {
			type: String,
			required: true,
		},

		stripeCustomerId: {
			type: String,
		},

		defaultSourceId: {
			type: String,
		},

		// NOTE: Can we have the MySQL data overwrite the MongoDB data?
		createdAt: {
			type: Date,
			required: true,
			default: Date.now,
		},

		// NOTE: Can we have the MySQL data overwrite the MongoDB data?
		updatedAt: {
			type: Date,
			required: true,
			default: Date.now,
		},

		status: {
			type: String,
			default: "ok",
		},

		passwordExpiresAt: {
			type: Date,
			required: true,
			default: Date.now,
		},

		/**
		 * FIXME A tinyint(1) like this acts as a Boolean; as MongoDB supports Boolean, it may make more sense to treat this field as a true / false Boolean type.
		 */
		roleUser: {
			type: Number,
			required: true,
			default: 1,
		},

		/**
		 * FIXME A tinyint(1) like this acts as a Boolean; as MongoDB supports Boolean, it may make more sense to treat this field as a true / false Boolean type.
		 */
		roleDev: {
			type: Number,
			required: true,
			default: 0,
		},

		/**
		 * FIXME A tinyint(1) like this acts as a Boolean; as MongoDB supports Boolean, it may make more sense to treat this field as a true / false Boolean type.
		 */
		roleAdmin: {
			type: Number,
			required: true,
			default: 0,
		},

		country: {
			type: String,
			required: true,
			default: "US",
		},

		/**
		 * FIXME A tinyint(1) like this acts as a Boolean; as MongoDB supports Boolean, it may make more sense to treat this field as a true / false Boolean type.
		 */
		roleBeta: {
			type: Number,
			required: true,
			default: 0,
		},

		productPlan: {
			type: String,
			required: true,
			default: "default",
		},
	},
	{
		timestamps: true,
	}
);

exports.Customer = mongoose.model("Customer", customerSchema);
