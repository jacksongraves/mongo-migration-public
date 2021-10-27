const mySQL = require("../../models/mysql");
const { Log } = require("../../models/mongodb/logModel");

// NOTE Not intended to be used as a server endpoint...
const loadAllLogs = async () => {
	// Get all the mySQL Book records
	return mySQL.Log?.findAll({ raw: true })
		.then((allLogs) => {
			console.log(`Successfully retrieved Logs from MySQL`);

			// Iterate through all Logs since we need to specify logic on a per verison basis
			const promises = [];
			allLogs.forEach((mysqlLog) =>
				// Attempt to load the book into MongoDB
				promises.push(
					loadLog(mysqlLog)
						.then((savedLog) => console.log(`Saved Log ${savedLog._id}`))
						.catch((error) => {
							console.error(`Error loading Log ${mysqlLog.id} to MongoDB`);
							console.error(error.message);
						})
				)
			);
			return Promise.all(promises);
		})
		.catch((error) => {
			console.error(`Error retrieving Logs from MySQL`);
			console.error(error.message);
		});
};

const loadLog = async (mysqlLog) => {
	// Template the mongoDB instance of the Log
	// Since ALL fields will be pulled as-is from SQL, and Log is a parent / master table, we can simply spread the mysqlLog
	const templateLog = {
		...mysqlLog,
		_mysqlId: mysqlLog.id,
	};

	// No child / referenced fields are required for this Log, so create and save it as-is
	const mongodbLog = new Log(templateLog);

	// Attempt to save the Log
	const savedLog = await mongodbLog.save();

	return savedLog;
};

module.exports = {
	loadAllLogs,
};
