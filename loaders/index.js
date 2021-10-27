const loaders = {
	independent: { ...require("./independent-loaders") },
	dependent: { ...require("./dependent-loaders") },
};
module.exports = {
	loaders,
};
