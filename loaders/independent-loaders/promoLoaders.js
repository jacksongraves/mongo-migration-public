const mySQL = require("../../models/mysql");
const { Promo } = require("../../models/mongodb/promoModel");

// NOTE Not intended to be used as a server endpoint...
const loadAllPromos = async () => {
	// Get all the mySQL Book records
	return mySQL.Promo?.findAll({ raw: true })
		.then((allPromos) => {
			console.log(`Successfully retrieved Promos from MySQL`);

			// Iterate through all Promos since we need to specify logic on a per verison basis
			const promises = [];
			allPromos.forEach((mysqlPromo) =>
				// Attempt to load the book into MongoDB
				promises.push(
					loadPromo(mysqlPromo)
						.then((savedPromo) => console.log(`Saved Promo ${savedPromo._id}`))
						.catch((error) => {
							console.error(`Error loading Promo ${mysqlPromo.id} to MongoDB`);
							console.error(error.message);
						})
				)
			);

			return Promise.all(promises);
		})
		.catch((error) => {
			console.error(`Error retrieving Promos from MySQL`);
			console.error(error.message);
		});
};

const loadPromo = async (mysqlPromo) => {
	// Template the mongoDB instance of the Promo
	// Since ALL fields will be pulled as-is from SQL, and Promo is a parent / master table, we can simply spread the mysqlPromo
	const templatePromo = {
		...mysqlPromo,
		_mysqlId: mysqlPromo.id,
	};

	// No child / referenced fields are required for this Promo, so create and save it as-is
	const mongodbPromo = new Promo(templatePromo);

	// Attempt to save the Promo
	const savedPromo = await mongodbPromo.save();

	return savedPromo;
};

module.exports = {
	loadAllPromos,
};
