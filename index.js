const asyncLoader = require("./asyncLoader");
const asyncDeleter = require("./asyncDeleter");
const asyncProducts = require("./asyncProducts");

const importData = async (params) => {
	try {
		// Attempt to load
		await asyncLoader();
		console.log("Completed loading");

		// Terminate the node script.
		process.exit();
	} catch (error) {
		console.error(error.message);

		// Terminate with failure.
		process.exit(1);
	}
};

const importProducts = async (params) => {
	try {
		// Attempt to load
		await asyncProducts();
		console.log("Completed loading");

		// Terminate the node script.
		process.exit();
	} catch (error) {
		console.error(error.message);

		// Terminate with failure.
		process.exit(1);
	}
};

const destroyData = async (params) => {
	try {
		// Attempt to delete
		await asyncDeleter();
		console.log("Completed deleting");

		// Terminate the node script.
		process.exit();
	} catch (error) {
		console.error(`${error.message}`.red.inverse);

		// Terminate with failure.
		process.exit(1);
	}
};

// Call the process via CLI argument
if (process.argv[2] === "-d") {
	destroyData();
} else if (process.argv[2] === "-p") {
	importProducts();
} else {
	importData();
}
