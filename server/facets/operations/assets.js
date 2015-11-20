const path = require('path');

exports.assetsHandler = {
	directory: {
		path: path.join(__dirname, '../../../front'),
		listing: false,
		index: false,
		lookupCompressed: true
	}
};
