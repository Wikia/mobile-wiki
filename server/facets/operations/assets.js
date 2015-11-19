/// <reference path="../../../typings/node/node.d.ts" />
import path = require('path');

var assetsHandler = {
	directory: {
		path: path.join(__dirname, '../../../front'),
		listing: false,
		index: false,
		lookupCompressed: true
	}
};

export = assetsHandler;

