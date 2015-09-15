/**
 * Wikia (Japan) Homepage
 *
 * @author Per Johan Groland <pgroland@wikia-inc.com>
 */

var util = require('../util');

function globals(request, reply) {
	var loggedIn = util.getLoginState(),
		loginUrl = util.getLoginUrl().replace(/&amp;/g, '&'),
		signupUrl = util.getSignupUrl().replace(/&amp;/g, '&'),
		script =
			'function getGlobals () {' +
			'	return { ' +
			'		loggedIn: '  + loggedIn + ', ' +
			'		loginUrl: \''  + loginUrl + '\', ' +
			'		signupUrl: \'' + signupUrl + '\' ' +
			'}}\n';

	return reply(script);
}

module.exports = globals;
