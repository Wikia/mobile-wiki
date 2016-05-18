/**
 * Helper methods for the Auth Flow
 */

import url from 'url';
import querystring from 'querystring';
import localSettings from '../../config/localSettings';
import authLocaleSettings from '../../config/authLocaleSettings.js';

/**
 * @typedef {Object} WhoAmIResponse
 * @property {string} [userId]
 * @property {number} [status]
 */

// @todo seems unused: wikiaSignupPathname = '/wiki/Special:UserSignup',
const wikiaLoginPathname = '/wiki/Special:UserLogin',
	forgotPasswordSearch = '?type=forgotPassword';

/**
 * @param {Hapi.Request} request
 * @returns {string}
 */
export function getRegisterUrl(request) {
	return this.getRedirectUrlWithQueryString('register', request);
}

/**
 * @param {string} redirect
 * @returns {string}
 */
export function getForgotPasswordUrlFromRedirect(redirect) {
	const forgotPasswordUrlObj = url.parse(redirect);

	forgotPasswordUrlObj.pathname = wikiaLoginPathname;
	forgotPasswordUrlObj.search = forgotPasswordSearch;
	return url.format(forgotPasswordUrlObj);
}

/**
 * @param {Hapi.Request} request
 * @returns {string}
 */
export function getSignInUrl(request) {
	return this.getRedirectUrlWithQueryString('signin', request);
}

/**
 * @param {string} redirect
 * @returns {string}
 */
export function getCacheBusterUrl(redirect) {
	const cacheBustedUrlObj = url.parse(redirect),
		query = querystring.parse(cacheBustedUrlObj.query);

	query.cb = Math.floor(Math.random() * 10000);
	cacheBustedUrlObj.search = querystring.stringify(query);

	return url.format(cacheBustedUrlObj);
}

/**
 * @param {string} route
 * @param {Hapi.Request} request
 * @returns {string}
 */
export function getRedirectUrlWithQueryString(route, request) {
	const redirectUrl = request.url;

	redirectUrl.pathname = route;
	return redirectUrl.format();
}

/**
 * @param {string} path
 * @returns {string}
 */
export function getHeliosUrl(path) {
	return url.format({
		protocol: 'https',
		host: localSettings.servicesDomain,
		pathname: localSettings.helios.path + path
	});
}

/**
 * @param {string} path
 * @param {object} query
 *
 * @returns {string}
 */
export function getHeliosLocalUrl(path, query) {
	const heliosUrlObj = url.parse(localSettings.helios.localUrl);

	heliosUrlObj.pathname = path;
	heliosUrlObj.search = querystring.stringify(query);

	return url.format(heliosUrlObj);
}

/**
 * @param {string} path
 * @returns {string}
 */
export function getUserRegistrationUrl(path) {
	return url.format({
		protocol: 'https',
		host: localSettings.servicesDomain,
		pathname: localSettings.userRegistationService.path + path
	});
}

/**
 * @param {string} path
 * @returns {string}
 */
export function getUserPreferencesUrl(path) {
	return url.format({
		protocol: 'https',
		host: localSettings.servicesDomain,
		pathname: localSettings.userPreferencesService.baseAPIPath + path
	});
}

/**
 * @returns {string}
 */
export function getWhoAmIUrl() {
	return url.format({
		protocol: 'https',
		host: localSettings.servicesDomain,
		pathname: localSettings.whoAmIService.path
	});
}

/**
 * @param {object} i18n
 * @returns {string}
 */
export function getLanguageWithDefault(i18n = {}) {
	const lang = i18n.lng();

	return authLocaleSettings.hasOwnProperty(lang) ? lang : 'en';
}
