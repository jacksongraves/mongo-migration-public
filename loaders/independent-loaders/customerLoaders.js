const mySQL = require("../../models/mysql");
const { Customer } = require("../../models/mongodb");

// NOTE Not intended to be used as a server endpoint...
const loadAllCustomers = async () => {
	// Get all the mySQL Book records
	return mySQL.Customer?.findAll({ raw: true })
		.then((allCustomers) => {
			console.log(`Successfully retrieved Customers from MySQL`);

			// Iterate through all Customers since we need to specify logic on a per customer basis
			const promises = [];
			allCustomers.forEach((mysqlCustomer) =>
				// Attempt to load the book into MongoDB
				promises.push(
					loadCustomer(mysqlCustomer)
						.then((savedCustomer) =>
							console.log(`Saved Customer ${savedCustomer._id}`)
						)
						.catch((error) => {
							console.error(
								`Error loading Customer ${mysqlCustomer.id} to MongoDB`
							);
							console.error(error.message);
						})
				)
			);
			return Promise.all(promises);
		})
		.catch((error) => {
			console.error(`Error retrieving Customers from MySQL`);
			console.error(error.message);
		});
};

const loadCustomer = async (mysqlCustomer) => {
	// Template the mongoDB instance of the Customer
	// Since ALL fields will be pulled as-is from SQL, and Customer is a parent / master table, we can simply spread the mysqlCustomer
	const templateCustomer = {
		...mysqlCustomer,
		_mysqlId: mysqlCustomer.id,
	};

	// No child / referenced fields are required for this Customer, so create and save it as-is
	const mongodbCustomer = new Customer(templateCustomer);

	// Attempt to save the SKU
	const savedCustomer = await mongodbCustomer.save();

	return savedCustomer;
};

module.exports = {
	loadAllCustomers,
};
