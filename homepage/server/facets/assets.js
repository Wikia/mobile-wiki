/**
 * Wikia (Japan) Homepage
 *
 * @author Per Johan Groland <pgroland@wikia-inc.com>
 */

var path = require('path');

var assetsHandler = {
	directory: {
		path: path.join(__dirname, '../../front'),
		listing: true,
		index: true,
		lookupCompressed: true
	}
};

module.exports = assetsHandler;
