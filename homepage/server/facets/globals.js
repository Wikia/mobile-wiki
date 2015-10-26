/**
 * Wikia (Japan) Homepage
 *
 * @author Per Johan Groland <pgroland@wikia-inc.com>
 */

var util = require('../util');

function globals(request, reply) {
	return reply({
		loginUrl: util.getLoginUrl(),
		signupUrl: util.getSignupUrl()
	});
}

module.exports = globals;
