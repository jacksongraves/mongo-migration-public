/**
 * https://www.npmjs.com/package/mongoose
 * Mongoose is a MongoDB object modeling tool designed to work in an asynchronous environment. Mongoose supports both promises and callbacks.
 */
const mongoose = require("mongoose");

/**
 * logSchema refers to a MongoDB Log collection / document type.
 * TODO While standard practice in MySQL is to name tables in the plural, with MongoDB, we'll use a singular naming convention for the schema itself.
 */
const logSchema = mongoose.Schema(
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
		},

		/**
		 * NOTE this is in addition to userName, if we are dealing with an authenticated user or can map the user and want to store that info in the login message.
		 */
		customer: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Customer",
		},

		source: {
			type: String,
		},

		message: {
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
	},
	{
		timestamps: true,
	}
);

exports.Log = mongoose.model("Logs", logSchema);
