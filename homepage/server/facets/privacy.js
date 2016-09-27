/**
 * Wikia (Japan) Homepage
 *
 * @author Per Johan Groland <pgroland@wikia-inc.com>
 */

var util = require('../util');

function privacy(request, reply) {
	var data = {
		title: ''
	};

	util.renderWithGlobalData(request, reply, data, 'privacy');
}

module.exports = privacy;
