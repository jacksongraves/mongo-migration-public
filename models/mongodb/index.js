// Utilize the index.js to aggregate our named exports.
// Using spread like this is generally not safe, however, we are ***only*** using named exports in this directory.
/**
 * https://www.npmjs.com/package/mongoose
 * Mongoose is a MongoDB object modeling tool designed to work in an asynchronous environment. Mongoose supports both promises and callbacks.
 */
const mongoose = require("mongoose");

/**
 * `connectMongoDB` is a more or less universal connector; It takes a Mongo URI string and connects directly to that database.
 */
const conn = (async () => {
	const conn = await mongoose.connect(process.env.MONGO_URI, {
		useUnifiedTopology: true,
		useNewUrlParser: true,
	});

	// const gridFS = Grid(conn.connection.db, mongoose.mongo);

	return conn;
})();

// const connectMongoDB = async () => {
// 	try {
// 		// Attempt to connect using some basic options
// 		const conn = await mongoose.connect(process.env.MONGO_URI, {
// 			useUnifiedTopology: true,
// 			useNewUrlParser: true,
// 		});

// 		const gridFS = Grid(conn.connection.db, mongoose.mongo);

// 		console.log(`MongoDB connected: ${conn.connection.db}`.cyan.underline);
// 	} catch (error) {
// 		// Handle an error
// 		console.error(
// 			`Error connecting to MongoDB: ${error.message}`.red.underline.bold
// 		);
// 	}
// };

// connectMongoDB();

module.exports = {
	// gridFS,
	conn,
	...require("./libraryModel"),
	...require("./customerModel"),
	...require("./donationModel"),
	...require("./giftModel"),
	...require("./loginModel"),
	...require("./logModel"),
	...require("./promoModel"),
	...require("./responseModel"),
	...require("./skuModel"),
	...require("./gridFSModel"),
	...require("./vfsModel"),
};
