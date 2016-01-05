/**
 * Wikia (Japan) Homepage
 *
 * @author Per Johan Groland <pgroland@wikia-inc.com>
 */

var util = require('../util');

function globals(request, reply) {
	return reply({
		loginUrl: util.getLoginUrl(),
		signupUrl: util.getSignupUrl(),
		mobileBreakpoint: 710,
		googleSearchOptimizelyId: (process.env.WIKIA_ENVIRONMENT === 'prod') ? 3571301500 : 3579160288,
	});
}

module.exports = globals;
