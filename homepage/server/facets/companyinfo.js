/**
 * Wikia (Japan) Homepage
 *
 * @author Per Johan Groland <pgroland@wikia-inc.com>
 */

function companyInfo(request, reply) {
	var data = {
		title: 'ウィキア・ジャパン',
	};

	return reply.view('companyinfo', data);
}

module.exports = companyInfo;
