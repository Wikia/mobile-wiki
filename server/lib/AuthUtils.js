/**
 * Helper methods for the Auth Flow
 */

const url = require('url'),
	querystring = require('querystring'),
	localSettings = require('../../config/localSettings'),
	// @todo seems unused: wikiaSignupPathname = '/wiki/Special:UserSignup',
	wikiaLoginPathname = '/wiki/Special:UserLogin',
	forgotPasswordSearch = '?type=forgotPassword';

/**
 * @param {Hapi.Request} request
 * @returns {string}
 */
exports.getRegisterUrl = function (request) {
	return this.getRedirectUrlWithQueryString('register', request);
};

/**
 * @param {string} redirect
 * @returns {string}
 */
exports.getForgotPasswordUrlFromRedirect = function (redirect) {
	const forgotPasswordUrlObj = url.parse(redirect);

	forgotPasswordUrlObj.pathname = wikiaLoginPathname;
	forgotPasswordUrlObj.search = forgotPasswordSearch;
	return url.format(forgotPasswordUrlObj);
};

/**
 * @param {Hapi.Request} request
 * @returns {string}
 */
exports.getSignInUrl = function (request) {
	return this.getRedirectUrlWithQueryString('signin', request);
};

/**
 * @param {string} redirect
 * @returns {string}
 */
exports.getCacheBusterUrl = function (redirect) {
	const cacheBustedUrlObj = url.parse(redirect),
		query = querystring.parse(cacheBustedUrlObj.query);

	query.cb = Math.floor(Math.random() * 10000);
	cacheBustedUrlObj.search = querystring.stringify(query);

	return url.format(cacheBustedUrlObj);
};

/**
 * @param {string} route
 * @param {Hapi.Request} request
 * @returns {string}
 */
exports.getRedirectUrlWithQueryString = function (route, request) {
	const redirectUrl = request.url;

	redirectUrl.pathname = route;
	return redirectUrl.format();
};

/**
 * @param {string} path
 * @returns {string}
 */
exports.getHeliosUrl = function (path) {
	return url.format({
		protocol: 'https',
		host: localSettings.servicesDomain,
		pathname: localSettings.helios.path + path
	});
};

/**
 * @returns {string}
 */
exports.getWhoAmIUrl = function () {
	return url.format({
		protocol: 'https',
		host: localSettings.servicesDomain,
		pathname: localSettings.whoAmIService.path
	});
};
