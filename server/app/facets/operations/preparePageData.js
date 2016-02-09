import localSettings from '../../../config/localSettings';
import deepExtend from 'deep-extend';

/**
 * @typedef {Object} OpenGraphData
 * @property {String} type
 * @property {String} title
 * @property {String} url
 * @property {String} [description]
 * @property {String} [image]
 */
/**
 * @param {Object} wikiVariables
 * @returns {boolean}
 */
export function isRtl(wikiVariables) {
	if (wikiVariables.language) {
		return wikiVariables.language.contentDir === 'rtl';
	}

	return false;
}

/**
 * @param {Hapi.Request} request
 * @returns {number}
 */
export function getUserId(request) {
	return request.auth.isAuthenticated ? request.auth.credentials.userId : 0;
}

/**
 * @param {Hapi.Request} request
 * @returns {boolean|String}
 */
export function getQualarooScriptUrl(request) {
	// all the third party scripts we don't want to load on noexternals
	if (!request.query.noexternals) {
		// qualaroo
		if (localSettings.qualaroo.enabled) {
			return localSettings.qualaroo.scriptUrl;
		}
	}

	return false;
}

/**
 *
 * @param {String} type
 * @param {String} title
 * @param {String} url
 * @param {Object} [pageData={}]
 * @returns {OpenGraphData}
 */
export function getOpenGraphData(type, title, url, pageData = {}) {
	const openGraphData = {
		type,
		title,
		url,
	};

	if (pageData && pageData.details) {
		if (pageData.details.abstract) {
			openGraphData.description = pageData.details.abstract;
		}

		if (pageData.details.thumbnail) {
			openGraphData.image = pageData.details.thumbnail;
		}
	}

	return openGraphData;
}

/**
 * @returns {LocalSettings}
 */
export function getLocalSettings() {
	return deepExtend({}, localSettings);
}
