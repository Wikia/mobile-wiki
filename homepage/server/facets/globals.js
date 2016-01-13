/**
 * Wikia (Japan) Homepage
 *
 * @author Per Johan Groland <pgroland@wikia-inc.com>
 */

var util = require('../util');

function globals(request, reply) {
	const useProductionOptimizely =
		(process.env.WIKIA_ENVIRONMENT === 'prod') ||
		(process.env.WIKIA_ENVIRONMENT === 'preview') ||
		(process.env.WIKIA_ENVIRONMENT === 'sandbox');

	return reply({
		loginUrl: util.getLoginUrl(),
		signupUrl: util.getSignupUrl(),
		mobileBreakpoint: 710,
		googleSearchOptimizelyId: useProductionOptimizely ? 4522280313 : 3579160288,
		jaCommunityUrl: util.getJaCommunityUrl(),
		jaUniversityUrl: util.getJaUniversityUrl(),
		startWikiaUrl: util.getStartWikiaUrl()
	});
}

module.exports = globals;
