/**
 * Wikia (Japan) Homepage
 *
 * @author Per Johan Groland <pgroland@wikia-inc.com>
 */

function contact(request, reply) {
	var data = {
		title: 'ウィキア・ジャパン',
	};

	return reply.view('contact', data);
}

module.exports = contact;
