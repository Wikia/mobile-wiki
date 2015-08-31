/**
 * Wikia (Japan) Homepage
 *
 * @author Per Johan Groland <pgroland@wikia-inc.com>
 */

var util = require('../util');

function login(request, reply) {
	var data = {
		title: 'ウィキア・ジャパン',
		heliosLoginURL: 'localhost:8111', //TODO: temporary
		loggedIn: util.getLoginState(),
		userName: util.getUserName()
	};

	return reply.view('signin', data);
}

module.exports = login;
