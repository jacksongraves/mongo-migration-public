/**
 * https://www.npmjs.com/package/mongoose
 * Mongoose is a MongoDB object modeling tool designed to work in an asynchronous environment. Mongoose supports both promises and callbacks.
 */
const mongoose = require("mongoose");

/**
 * productSchema refers to a MongoDB Product collection / document type.
 * TODO While standard practice in MySQL is to name tables in the plural, with MongoDB, we'll use a singular naming convention for the schema itself.
 *
 * NOTE the idea here is we can perhaps "unwrap" the nested JSON; it doesn't represent a "ton" of memory on the client (or in the database): we have 9293 bytes in `products.json` now, and would probably have about 100kb if unwrapped. For a one-time dump, this might not be the end of the world (especially since we don't have to write it by hand). This makes our data structure a bit more lean and less dependent on nesting.
 */
const productSchema = mongoose.Schema(
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
			required: true,
		},

		//? TODO Optional
		imageName: {
			type: String,
			required: true,
		},

		//? TODO Optional
		imageId: {
			type: String,
			required: true,
		},

		template: {
			type: String,
			required: true,
		},

		summary: {
			type: String,
			required: true,
		},

		caption: {
			type: String,
			required: true,
		},

		currency: {
			type: Boolean,
			required: true,
		},

		price: {
			type: Number,
			required: true,
		},

		// TODO what is this?
		priceOpt: {
			type: String,
			required: true,
		},

		priceMin: {
			type: Number,
		},

		priceMax: {
			type: Number,
		},

		priceInc: {
			type: Number,
		},

		pricePrompt: {
			type: String,
		},

		/**
		 * NOTE to directly replace the reference to `skuCode`
		 * 	skuCode: {
		 *		type: String,
		 * 		required: true,
		 *	},
		 */
		skuId: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: "SKU",
		},

		// TODO seems a bit redundant to the translation, with exception of "donate" being "n/a"
		// name: {
		// 	type: String,
		// 	required: true,
		// },

		/**
		 * FIXME Seeing as:
		 * - translationId is the only "important" value
		 * - we'll likely only ever have a small number of translations
		 * - The translation itself is "parsed" on the client / mobile app / user interface
		 * Could we drop the translation name and instead have it enumerated in the app? Then we can just reference the translation id as an enumerated field here.
		 *
		 * If not, we can enumerate on the back end and reference by ObjectID, but this seems overkill.
		 */
		translationId: {
			type: String,
			required: true,
		},

		// FIXME see above
		translationName: {
			type: String,
			required: true,
		},

		/**
		 * FIXME Seeing as:
		 * - deliveryId is the only "important" value
		 * - we'll likely only ever have a small number of delivery options (gift, mylib, and donate)
		 * - The delivery method itself is "parsed" on the client / mobile app / user interface
		 * Could we drop the deliveryName and instead have it enumerated in the app? Then we can just reference the deliveryId as an enumerated field here.
		 *
		 * If not, we can enumerate on the back end and reference by ObjectID, but this seems overkill.
		 */
		deliveryId: {
			type: String,
			required: true,
		},

		// FIXME see above
		deliveryName: {
			type: String,
			required: true,
		},

		fullName: {
			type: Number,
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

exports.Product = mongoose.model("Product", productSchema);
