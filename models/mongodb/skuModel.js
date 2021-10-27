/**
 * https://www.npmjs.com/package/mongoose
 * Mongoose is a MongoDB object modeling tool designed to work in an asynchronous environment. Mongoose supports both promises and callbacks.
 */
const mongoose = require("mongoose");

/**
 * skuSchema refers to a MongoDB SKU collection / document type.
 * TODO While standard practice in MySQL is to name tables in the plural, with MongoDB, we'll use a singular naming convention for the schema itself.
 */
const skuSchema = mongoose.Schema(
	{
		/**
		 * FIXME Number will take in an Int, but does not guarantee it casts properly.
		 * MongoDB uses an ObjectID uuid string instead, so this will ultimately be redundant.
		 * NOTE: Since SKUs is a static file, we don't really have a MySQL id for a SKU. So, this one doesn't need a special identifier since it maps directly to the static file.
		 */
		id: {
			// JSON
			type: String,
			required: true,
		},

		_skuId: {
			// JSON duplicate
			type: String,
			// required: true,
		},

		name: {
			type: String,
		},

		code: {
			// JSON
			type: String,
		},

		imageName: {
			type: String,
		},

		imageId: {
			type: String,
		},

		gift: {
			type: String,
		},

		price: {
			type: Number,
		},

		currency: {
			type: String,
		},

		entitlement: {
			type: Boolean,
		},

		isCompanion: {
			type: Boolean,
		},

		isTest: {
			type: Boolean,
		},

		summary: {
			type: String,
		},

		userData: {
			type: String,
		},

		size: {
			type: String,
		},
	},
	{
		timestamps: true,
	}
);

exports.SKU = mongoose.model("SKU", skuSchema);
