/**
 * https://www.npmjs.com/package/mongoose
 * Mongoose is a MongoDB object modeling tool designed to work in an asynchronous environment. Mongoose supports both promises and callbacks.
 */
const mongoose = require("mongoose");

/**
 * promoSchema refers to a MongoDB Promo collection / document type.
 * TODO While standard practice in MySQL is to name tables in the plural, with MongoDB, we'll use a singular naming convention for the schema itself.
 */
const promoSchema = mongoose.Schema(
	{
		/**
		 * FIXME Number will take in an Int, but does not guarantee it casts properly.
		 * MongoDB uses an ObjectID uuid string instead, so this will ultimately be redundant.
		 */
		_mysqlId: {
			type: Number,
			required: true,
		},

		name: {
			type: String,
		},

		percentage: {
			type: Number,
		},

		startDate: {
			type: Date,
			default: Date.now,
		},

		endDate: {
			type: Date,
			default: Date.now,
		},

		maxUse: {
			type: Number,
		},

		/**
		 * NOTE Should this be a reference to a MongoDB ObjectID?
		 */
		createdBy: {
			type: String,
		},

		status: {
			type: String,
		},

		country: {
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

exports.Promo = mongoose.model("Promo", promoSchema);
