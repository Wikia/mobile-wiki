/**
 * Wikia (Japan) Homepage
 *
 * @author Per Johan Groland <pgroland@wikia-inc.com>
 */

function privacy(request, reply) {
	var data = {
		title: 'ウィキア・ジャパン',
	};

	return reply.view('privacy', data);
}

module.exports = privacy;
