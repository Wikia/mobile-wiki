import deepExtend from 'deep-extend';
import settings from '../../../config/settings';
import {gaUserIdHash} from '../../lib/hashing';

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
	// we don't want to load Qualaroo on noexternals
	if (!request.query.noexternals && settings.qualaroo.enabled) {
		return settings.qualaroo.scriptUrl;
	}

	return false;
}

/**
 * @param {Hapi.Request} request
 * @returns {boolean|String}
 */
export function getOptimizelyScriptUrl(request) {
	// we don't want to load Optimizely on noexternals
	if (!request.query.noexternals && settings.optimizely.enabled) {
		return `${settings.optimizely.scriptPath}${settings.optimizely.account}.js`;
	}

	return false;
}

/**
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
		url
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
 * @param {Object} wikiVariables
 * @returns {String} url for openGraph
 */
export function getOpenGraphUrl(wikiVariables) {
	return wikiVariables.basePath + wikiVariables.articlePath + wikiVariables.siteName.replace(/ /g, '_');
}

/**
 * Get vertical color from settings
 *
 * @param {string} vertical
 * @returns {string}
 */
export function getVerticalColor(vertical) {
	if (settings.verticalColors.hasOwnProperty(vertical)) {
		return settings.verticalColors[vertical];
	}

	return null;
}

/**
 * @returns {Settings}
 */
export function getSettings() {
	return deepExtend({}, settings);
}

/**
 * @param {Hapi.Request} request
 * @param {Object} pageData
 * @returns {String}
 */
export function getDisplayTitle(request, pageData) {
	if (pageData) {
		if (pageData.article && pageData.article.displayTitle) {
			return pageData.article.displayTitle;
		} else if (pageData.details && pageData.details.title) {
			return pageData.details.title;
		}
	}

	return request.params.title.replace(/_/g, ' ');
}

/**
 * @param {Hapi.Request} request
 * @param {MediaWikiPageData} data
 * @returns {object}
 */
export function getBaseResult(request, data) {
	const wikiVariables = data.wikiVariables,
		htmlTitleSettings = wikiVariables.htmlTitle,
		userId = getUserId(request);

	return {
		canonicalUrl: wikiVariables.basePath,
		wikiHtmlTitle: htmlTitleSettings.parts.join(htmlTitleSettings.separator),
		gaUserIdHash: gaUserIdHash(userId),
		isRtl: isRtl(wikiVariables),
		// clone object to avoid overriding real settings for future requests
		settings: getSettings(),
		optimizelyScript: getOptimizelyScriptUrl(request),
		qualarooScript: getQualarooScriptUrl(request),
		server: data.server,
		themeColor: getVerticalColor(wikiVariables.vertical),
		userId,
		wikiVariables
	};
}
