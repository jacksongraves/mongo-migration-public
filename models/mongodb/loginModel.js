/**
 * https://www.npmjs.com/package/mongoose
 * Mongoose is a MongoDB object modeling tool designed to work in an asynchronous environment. Mongoose supports both promises and callbacks.
 */
const mongoose = require("mongoose");

/**
 * loginSchema refers to a MongoDB Login collection / document type.
 * TODO While standard practice in MySQL is to name tables in the plural, with MongoDB, we'll use a singular naming convention for the schema itself.
 */
const loginSchema = mongoose.Schema(
	{
		/**
		 * FIXME Number will take in an Int, but does not guarantee it casts properly.
		 * MongoDB uses an ObjectID uuid string instead, so this will ultimately be redundant.
		 */
		_mysqlId: {
			type: Number,
			required: true,
		},

		status: {
			type: String,
		},

		userName: {
			type: String,
		},

		/**
		 * NOTE this is in addition to userName, if we are dealing with an authenticated user or can map the user and want to store that info in the login message.
		 */
		customer: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Customer",
		},

		appName: {
			type: String,
		},

		appVersion: {
			type: String,
		},

		brand: {
			type: String,
		},

		bundleId: {
			type: String,
		},

		buildNumber: {
			type: String,
		},

		buildType: {
			type: String,
		},

		bundleVersion: {
			type: String,
		},

		carrier: {
			type: String,
		},

		deviceId: {
			type: String,
		},

		deviceName: {
			type: String,
		},

		systemName: {
			type: String,
		},

		systemVersion: {
			type: String,
		},

		uniqueId: {
			type: String,
		},

		isEmulator: {
			type: String,
		},

		host: {
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

		country: {
			type: String,
			required: true,
			default: "US",
		},
	},
	{
		timestamps: true,
	}
);

exports.Login = mongoose.model("Login", loginSchema);
