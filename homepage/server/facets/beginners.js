/**
 * Wikia (Japan) Homepage
 *
 * @author Per Johan Groland <pgroland@wikia-inc.com>
 */

var deepExtend = require('deep-extend'),
	util = require('../util');

function beginners(request, reply) {
	var data = deepExtend({
		title: 'ウィキア・ジャパン',
	}, util.getGlobalData());

	return reply.view('beginners', data);
}

module.exports = beginners;
