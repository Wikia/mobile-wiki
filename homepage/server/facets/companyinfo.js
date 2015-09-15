/**
 * Wikia (Japan) Homepage
 *
 * @author Per Johan Groland <pgroland@wikia-inc.com>
 */

var deepExtend = require('deep-extend'),
	util = require('../util');

function companyInfo(request, reply) {
	var data = deepExtend({
		title: 'ウィキア・ジャパン',
	}, util.getGlobalData());

	return reply.view('companyinfo', data);
}

module.exports = companyInfo;
