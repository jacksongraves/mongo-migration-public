/**
 * https://www.npmjs.com/package/mongoose
 * Mongoose is a MongoDB object modeling tool designed to work in an asynchronous environment. Mongoose supports both promises and callbacks.
 */
const mongoose = require("mongoose");

/**
 * vfsSchema refers to a MongoDB VFs collection / document type.
 * TODO While standard practice in MySQL is to name tables in the plural, with MongoDB, we'll use a singular naming convention for the schema itself.
 */
const vfsSchema = mongoose.Schema(
	{
		/**
		 * FIXME Number will take in an Int, but does not guarantee it casts properly.
		 * MongoDB uses an ObjectID uuid string instead, so this will ultimately be redundant.
		 */
		_mysqlId: {
			type: Number,
			required: true,
		},

		// NOTE: _skuId will not be passed directly.
		_skuObjectID: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: "SKU",
		},

		/**
		 * NOTE: The `data` field exists in mySQL as a Blob. We can deep load a VFS, but cannot store the Blob directly in VFS. Instead, it will reside in GridFS and be referenced by the GridFS `fs.files._id` as `_gridFSObjectID`.
		 */
		_gridFSObjectID: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			// ref: "fs.files",
		},

		filename: {
			type: String,
			required: true,
		},

		type: {
			type: String,
		},

		version: {
			type: String,
		},

		description: {
			type: String,
		},

		size: {
			type: Number,
		},

		env: {
			type: String,
		},

		buildMode: {
			type: String,
		},

		buildType: {
			type: String,
		},

		releasedAt: {
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
	},
	{
		timestamps: true,
	}
);

exports.VFS = mongoose.model("VFS", vfsSchema);
