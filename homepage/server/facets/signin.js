/**
 * Wikia (Japan) Homepage
 *
 * @author Per Johan Groland <pgroland@wikia-inc.com>
 */

function login(request, reply) {
	var data = {
		title: 'ウィキア・ジャパン',
		heliosLoginURL: 'localhost:8111' //TODO: temporary
	};

	return reply.view('signin', data);
}

module.exports = login;
