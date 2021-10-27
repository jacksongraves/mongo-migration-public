/**
 * https://www.npmjs.com/package/mongoose
 * Mongoose is a MongoDB object modeling tool designed to work in an asynchronous environment. Mongoose supports both promises and callbacks.
 */
const mongoose = require("mongoose");

/**
 * giftSchema refers to a MongoDB Gift collection / document type.
 * TODO While standard practice in MySQL is to name tables in the plural, with MongoDB, we'll use a singular naming convention for the schema itself.
 */
const giftSchema = mongoose.Schema(
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

		recipientName: {
			type: String,
		},

		recipientEmail: {
			type: String,
		},

		/**
		 * NOTE an optional reference to `recipient` if available.
		 */
		_recipientObjectID: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Customer",
		},

		/**
		 * NOTE to directly replace the reference to `giverName` and `giverEmail`
		 */
		_giverObjectID: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: "Customer",
		},

		sentAt: {
			type: Date,
			default: Date.now,
		},

		receivedAt: {
			type: Date,
			default: Date.now,
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

		/**
		 * FIXME Is this one still relevant?
		 */
		item: {
			type: String,
		},

		_skuObjectID: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: "SKU",
		},

		// NOTE: Can we have the MySQL data overwrite the MongoDB data?
		updatedAt: {
			type: Date,
			required: true,
			default: Date.now,
		},

		// NOTE: Can we have the MySQL data overwrite the MongoDB data?
		createdAt: {
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

exports.Gift = mongoose.model("Gift", giftSchema);
