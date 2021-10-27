/**
 * https://www.npmjs.com/package/mongoose
 * Mongoose is a MongoDB object modeling tool designed to work in an asynchronous environment. Mongoose supports both promises and callbacks.
 */
const mongoose = require("mongoose");

/**
 * librarySchema refers to a MongoDB Library collection / document type.
 * This collection (Library) directly maps to the MySQL (Book) table.
 * TODO While standard practice in MySQL is to name tables in the plural, with MongoDB, we'll use a singular naming convention for the schema itself.
 */
const librarySchema = mongoose.Schema(
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

		/**
		 * NOTE to directly replace the reference to `ownerEmail`
		 * FIXME this could be a problem; won't we need `ownerEmail` to maintain the offline email / onboarding flow for a non-customer gift?
		 */
		_customerObjectID: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: "Customer",
		},

		_skuObjectID: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: "SKU",
		},

		_giftObjectID: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Gift",
		},

		/**
		 * FIXME We can probably reference the Order directly by its MongoDB ObjectID uuid string, or via a Mongoose Schema reference.
		 * 	order: {
		 *		type: mongoose.Schema.Types.ObjectId,
		 *		ref: "Order",
		 *	},
		 */
		orderId: {
			type: String,
		},

		item: {
			type: String,
		},

		bookName: {
			type: String,
		},

		readAt: {
			type: Date,
			default: Date.now,
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

		source: {
			type: String,
			required: true,
			default: "emapp",
		},
	},
	{
		timestamps: true,
	}
);

exports.Library = mongoose.model("Library", librarySchema);
