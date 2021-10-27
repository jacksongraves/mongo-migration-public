const fs = require("fs/promises");
const path = require("path");

// Path to the config file
// const workingDir = process.cwd() || os.homedir();

const getJSON = async (folder, name = "") => {
	// Pre-empt an edge case
	let output = {};

	if (name) {
		// Catch the edge case where a user may not have supplied the .json extension
		const filename = /\.json$/.test(name) ? name : `${name}.json`;

		// Attempt to read the file
		let file = "";
		file = await fs.readFile(path.resolve(folder, filename), {
			encoding: "utf-8",
		});

		// Attempt to parse the JSON
		if (file) {
			output = JSON.parse(file);
		}
	}

	// Return the output regardless
	return output;
};

module.exports = getJSON;
