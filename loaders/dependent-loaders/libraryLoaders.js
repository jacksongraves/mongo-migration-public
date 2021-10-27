const mySQL = require("../../models/mysql");
const { Library } = require("../../models/mongodb");
const { Customer } = require("../../models/mongodb");
const { Gift } = require("../../models/mongodb");
const { SKU } = require("../../models/mongodb");

// NOTE Not intended to be used as a server endpoint...
const loadAllBooksToLibrary = async () => {
	// Get all the mySQL Book records
	return mySQL.Book?.findAll({ raw: true })
		.then((allBooks) => {
			console.log(`Successfully retrieved Books from MySQL`);

			// Iterate through all books since we need to specify logic on a per book basis
			const promises = [];
			allBooks.forEach((mysqlBook) =>
				// Attempt to load the book into MongoDB
				promises.push(
					loadBookToLibrary(mysqlBook)
						.then((savedBook) => console.log(`Saved Book ${savedBook._id}`))
						.catch((error) => {
							console.error(`Error loading Library ${mysqlBook.id} to MongoDB`);
							console.error(error.message);
						})
				)
			);

			return Promise.all(promises);
		})
		.catch((error) => {
			console.error(`Error retrieving Books from MySQL`);
			console.error(error.message);
		});
};

// Books have a 1 customer < Many Books
// Books have a 1 gift < Many Books
const loadBookToLibrary = async (mysqlBook) => {
	// Unwrap the mySQL instance of the book
	const {
		id,
		status,
		ownerEmail,
		readAt,
		giftId,
		orderId,
		item,
		bookName,
		sku: _skuId,
		createdAt,
		updatedAt,
		source,
	} = mysqlBook;

	// Template the mongoDB instance of the book
	const templateBook = {
		_mysqlId: id,
		status,
		// ownerEmail, // Dependent field
		readAt,
		// giftId, // Dependent field
		orderId,
		item,
		bookName,
		// sku, // Dependent field
		createdAt,
		updatedAt,
		source,
	};

	// Attempt to locate the customer
	const customer =
		ownerEmail && (await Customer.findOne({ email: ownerEmail }).lean());

	// If the customer exists, inject its id
	if (customer) templateBook._customerObjectID = customer._id.toString();

	// Attempt to locate the gift
	const gift = giftId && (await Gift.findOne({ id: giftId }).lean());

	// If the gift exists, inject its id
	if (gift) templateBook._giftObjectID = gift._id.toString();

	// Attempt to locate the SKU
	const sku = _skuId && (await SKU.findOne({ _skuId }).lean());

	// If the SKU exists, inject its id
	if (sku) templateBook._skuObjectID = sku._id.toString();

	// Having completed the mongoDB Book template, attempt to create it and save it
	const mongodbBook = new Library(templateBook);

	const savedBook = await mongodbBook.save();

	return savedBook;
};

module.exports = {
	loadAllBooksToLibrary,
};
