/**
 * Wikia (Japan) Homepage
 *
 * @author Per Johan Groland <pgroland@wikia-inc.com>
 */

'use strict';

var path = require('path'),
	assetsHandler = {
		directory: {
			path: path.join(__dirname, '../../front'),
			listing: true,
			index: true,
			lookupCompressed: true
		}
	};

module.exports = assetsHandler;
