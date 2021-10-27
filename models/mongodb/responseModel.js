/**
 * https://www.npmjs.com/package/mongoose
 * Mongoose is a MongoDB object modeling tool designed to work in an asynchronous environment. Mongoose supports both promises and callbacks.
 */
const mongoose = require("mongoose");

/**
 * responseSchema refers to a MongoDB Response collection / document type.
 * TODO While standard practice in MySQL is to name tables in the plural, with MongoDB, we'll use a singular naming convention for the schema itself.
 */
const responseSchema = mongoose.Schema(
	{
		// NOTE: _mysqlID is omitted as `response` is greenfield and not dependent on legacy code

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

		/**
		 * NOTE Assuming that this refers to the key of the response in the document, do we instead want it to refer to a MongoDB UUID?
		 * It largely depends on how you want this to grow / adapt in the future. If we stay in xhtml permanently, then this shouldn't be an issue.
		 */
		key: {
			type: String,
		},

		response: {
			type: String,
		},

		deviceName: {
			type: String,
		},

		deviceUid: {
			type: String,
		},

		deviceAt: {
			// deviceUpdatedAt
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

exports.Response = mongoose.model("Response", responseSchema);
