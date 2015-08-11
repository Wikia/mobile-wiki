/**
 * Wikia (Japan) Homepage
 *
 * @author Per Johan Groland <pgroland@wikia-inc.com>
 */

function beginners(request, reply) {
	var data = {
		title: 'ウィキア・ジャパン',
	};

	return reply.view('beginners', data);
}

module.exports = beginners;
