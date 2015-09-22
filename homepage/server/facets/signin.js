/**
 * Wikia (Japan) Homepage
 *
 * @author Per Johan Groland <pgroland@wikia-inc.com>
 */

var util = require('../util');

function login(request, reply) {
	var data = {
		title: 'ウィキア・ジャパン'
	};

	util.renderWithGlobalData(request, reply, data, 'signin');
}

module.exports = login;
