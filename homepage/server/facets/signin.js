/**
 * Wikia (Japan) Homepage
 *
 * @author Per Johan Groland <pgroland@wikia-inc.com>
 */

var deepExtend = require('deep-extend'),
	util = require('../util');

function login(request, reply) {
	var data = deepExtend({
		title: 'ウィキア・ジャパン',
		heliosLoginURL: 'localhost:8111' //TODO: temporary
	}, util.getGlobalData());

	return reply.view('signin', data);
}

module.exports = login;
