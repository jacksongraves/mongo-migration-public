const mySQL = require("../../models/mysql");
const { Login } = require("../../models/mongodb/loginModel");

// NOTE Not intended to be used as a server endpoint...
const loadAllLogins = async () => {
	// Get all the mySQL Book records
	return mySQL.Login?.findAll({ raw: true })
		.then((allLogins) => {
			console.log(`Successfully retrieved Logins from MySQL`);

			// Iterate through all Logins since we need to specify logic on a per verison basis
			const promises = [];
			allLogins.forEach((mysqlLogin) =>
				// Attempt to load the book into MongoDB
				promises.push(
					loadLogin(mysqlLogin)
						.then((savedLogin) => console.log(`Saved Login ${savedLogin._id}`))
						.catch((error) => {
							console.error(`Error loading Login ${mysqlLogin.id} to MongoDB`);
							console.error(error.message);
						})
				)
			);
			return Promise.all(promises);
		})
		.catch((error) => {
			console.error(`Error retrieving Logins from MySQL`);
			console.error(error.message);
		});
};

const loadLogin = async (mysqlLogin) => {
	// Template the mongoDB instance of the Login
	// Since ALL fields will be pulled as-is from SQL, and Login is a parent / master table, we can simply spread the mysqlLogin
	const templateLogin = {
		...mysqlLogin,
		_mysqlId: mysqlLogin.id,
	};

	// No child / referenced fields are required for this Login, so create and save it as-is
	const mongodbLogin = new Login(templateLogin);

	// Attempt to save the Login
	const savedLogin = await mongodbLogin.save();

	return savedLogin;
};

module.exports = {
	loadAllLogins,
};
