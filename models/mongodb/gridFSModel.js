/**
 * https://www.npmjs.com/package/mongoose
 * Mongoose is a MongoDB object modeling tool designed to work in an asynchronous environment. Mongoose supports both promises and callbacks.
 *
 * * https://www.npmjs.com/package/gridfile
 * * https://www.reddit.com/r/node/comments/8pouow/how_to_create_read_stream_from_buffer/
 * * https://stackoverflow.com/questions/13230487/converting-a-buffer-into-a-readablestream-in-node-js/44091532#44091532
 * * https://stackoverflow.com/questions/10623798/how-do-i-read-the-contents-of-a-node-js-stream-into-a-string-variable
 * * https://gist.github.com/abskmj/2dafbf3296ef5dc0c7a2054110c75e53
 *
 */
const mongoose = require("mongoose");
const fs = require("fs");
const { Duplex, Readable } = require("stream"); // Native Node Module

// https://www.npmjs.com/package/gridfile
const GridFSSchema = require("gridfile");

/**
 * ***Create a GridFS Model***
 * Due to the `gridfile` package, the schema will be a custom GridFile type that is capable of supporting the buffer and chunks. The primary point of access should be through `GridFSFiles` as it handles reading from / writing to `fs.files` and `fs.chunks`. However, if needed, `GridFSChunks` is a direct reference to `fs.chunks` in case stricter methods are needed (e.g., `GridFSChunks.deleteMany()`, because `GridFSFiles.deleteMany()` only deletes from `fs.files` and not from `fs.chunks`.)
 */
const GridFSFiles = mongoose.model("GridFS", GridFSSchema);
const GridFSChunks = mongoose.model("fs.chunks", mongoose.Schema({}, {}));

/**
 * Helper function, takes in a Buffer and converts it to a Stream. MySQL blob comes back as a Buffer, to interact with Node (and further to interact with MongoDB) it must be converted to a Stream.
 */
const bufferToStream = (buf) => {
	let tmp = new Duplex();
	tmp.push(buf);
	tmp.push(null);
	return tmp;
};

/**
 * Helper function, takes in a Stream and converts it to a utf8 string. Don't recommend printing the string for a blob due to the size, however if there's edit-in-place logic applied or string operations, this is where to use it.
 */
const streamToString = (stream) => {
	const chunks = [];
	return new Promise((resolve, reject) => {
		stream.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
		stream.on("error", (err) => reject(err));
		stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
	});
};

/**
 * @function uploadFile
 * @description Takes in a blob (Buffer), and uploads it blindly to GridFS. We assume the blob is already a buffer. Uploads a single `epub` by taking in the Buffer (this is what Sequelize gives us from the MySQL database) and a filename. The filename might not get used.
 * @param {Buffer} blob the Buffer retrieved from the MySQL blob field
 * @param {string} filename A string filename
 * @returns {fs.files}
 * @example
 *   {
 *     aliases: [],
 *     _id: ObjectID(5f3e8f06a37b5c4b1934a070),
 *     length: 7945,
 *     chunkSize: 261120,
 *     uploadDate: Date("2020-08-20T14:56:06.925Z"),
 *     filename: 'attachment.pdf',
 *     md5: 'fa7d7e650b2cec68f302b31ba28235d8'
 *   }
 */
const uploadFile = async (blob, filename) => {
	/**
	 * Standard practice is to upload the fileStream from a local directory file. However, we are not doing this because we have a buffer already.
	 * @example
	 * const fileStream = fs.createReadStream(path.join(__dirname, 'attachment.pdf'))
	 *
	 * @example
	 * const blobStream = new Readable();
	 * blobStream.push(blob); // the string you want
	 * blobStream.push(null); // indicates end-of-file basically - the end of the stream
	 */

	console.log("uploading file", filename);
	// However, we have a Buffer from the MySQL database (as opposed to a local file), so we want to convert it to a Stream.
	const readableFileStream = bufferToStream(blob);

	// Create a reference to the GridFS schema
	const gridFSFiles = new GridFSFiles();

	// Update the filename on the schema (this is universal to the GridFS schema, not unique to the blob)
	gridFSFiles.filename = filename;

	// Upload the epub by passing in the stream
	const uploadedFile = await gridFSFiles.upload(readableFileStream); // filestream

	// Logging the output will show us the ObjectID that MongoDB uses to reference the file -> chunks
	return uploadedFile;
};

/**
 * @function listFiles
 * @description Simply lists all epubs in the file collection (not the binaries in the chunks collection)
 * @example
 * [
 *   {
 * 		 _id: new ObjectId("614a9f59ff615ca513d87f47"),
 * 		 length: 7235709,
 * 		 chunkSize: 261120,
 * 		 uploadDate: Date("2021-09-22T03:13:49.430Z"),
 * 		 filename: 'lg_kjv.epub',
 * 		 aliases: []
 *   },
 *   {
 * 	   _id: new ObjectId("614aa0415e37133d982bcded"),
 * 	   length: 7235709,
 * 	   chunkSize: 261120,
 * 	   uploadDate: Date("2021-09-22T03:17:38.034Z"),
 * 	   filename: 'lg_kjv.epub',
 * 	   aliases: []
 *   }
 * ]
 */
const listFiles = async () => {
	const files = await GridFSFiles.find({});
	return files;
};

/**
 * Retrieves a single epub by its MongoDB file ID (could be extended to pull by filename or sku if guaranteed to be universally unique).
 * @param {ObjectID} id
 */
const getFileById = async (_id) => {
	// Attempt to locate the epub by its ObjectID
	// TODO update this to cover other keys in the search
	const file = await GridFSFiles.findById(_id);

	if (file) {
		// Call a method to extract the Stream of the epub
		const downloadStream = file.getDownloadStream();

		// If necessary, convert the stream to a utf8 string
		let fileString = await streamToString(downloadStream);

		return fileString;
	} else {
		return "NOT FOUND";
	}
};

module.exports = {
	GridFSFiles,
	GridFSChunks,
	uploadFile,
	listFiles,
	getFileById,
	streamToString,
	bufferToStream,
};
