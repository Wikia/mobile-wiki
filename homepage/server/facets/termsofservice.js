/**
 * Wikia (Japan) Homepage
 *
 * @author Per Johan Groland <pgroland@wikia-inc.com>
 */

function termsOfService(request, reply) {
	var data = {
		title: 'ウィキア・ジャパン',
	};

	return reply.view('termsofservice', data);
}

module.exports = termsOfService;
