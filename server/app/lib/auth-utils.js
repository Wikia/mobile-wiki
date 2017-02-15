/**
 * Helper methods for the Auth Flow
 */

import url from 'url';
import querystring from 'querystring';
import settings from '../../config/settings';

/**
 * @param {string} path
 * @param {object} query
 *
 * @returns {string}
 */
export function getHeliosInternalUrl(path, query) {
	const heliosUrlObj = url.parse(settings.helios.internalUrl);

	heliosUrlObj.pathname = path;
	heliosUrlObj.search = querystring.stringify(query);

	return url.format(heliosUrlObj);
}
