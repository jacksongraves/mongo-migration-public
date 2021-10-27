/**
 * https://www.npmjs.com/package/mongoose
 * Mongoose is a MongoDB object modeling tool designed to work in an asynchronous environment. Mongoose supports both promises and callbacks.
 */
const mongoose = require("mongoose");

/**
 * donationSchema refers to a MongoDB Donation collection / document type.
 * TODO While standard practice in MySQL is to name tables in the plural, with MongoDB, we'll use a singular naming convention for the schema itself.
 */
const donationSchema = mongoose.Schema(
	{
		/**
		 * FIXME Number will take in an Int, but does not guarantee it casts properly.
		 * MongoDB uses an ObjectID uuid string instead, so this will ultimately be redundant.
		 */
		_mysqlId: {
			type: Number,
			required: true,
		},

		_skuObjectID: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: "SKU",
		},

		/**
		 * NOTE replaces the reference to `user` which is an email address
		 */
		_customerObjectID: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: "Customer",
		},

		amount: {
			type: Number,
		},

		currency: {
			type: String,
		},

		/**
		 * NOTE Unless this field refers to something different, would it be better suited as a Boolean? or are there multiple enumerated recurring frequencies?
		 */
		recurring: {
			type: String,
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

		/**
		 * NOTE Could we extract this as its own Schema and reference by ObjectID?
		 */
		item: {
			type: String,
		},
	},
	{
		timestamps: true,
	}
);

exports.Donation = mongoose.model("Donation", donationSchema);
