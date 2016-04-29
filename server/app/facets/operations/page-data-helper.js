import deepExtend from 'deep-extend';
import localSettings from '../../../config/localSettings';
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
	if (!request.query.noexternals && localSettings.qualaroo.enabled) {
		return localSettings.qualaroo.scriptUrl;
	}

	return false;
}

/**
 * @param {Hapi.Request} request
 * @returns {boolean|String}
 */
export function getOptimizelyScriptUrl(request) {
	// we don't want to load Optimizely on noexternals
	if (!request.query.noexternals && localSettings.optimizely.enabled) {
		return `${localSettings.optimizely.scriptPath}${localSettings.optimizely.account}.js`;
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
 * Get vertical color from localSettings
 *
 * @param {string} vertical
 * @returns {string}
 */
export function getVerticalColor(vertical) {
	if (localSettings.verticalColors.hasOwnProperty(vertical)) {
		return localSettings.verticalColors[vertical];
	}

	return null;
}

/**
 * @returns {LocalSettings}
 */
export function getLocalSettings() {
	return deepExtend({}, localSettings);
}

/**
 * @param {Hapi.Request} request
 * @param {Object} pageData
 * @returns {String}
 */
export function getDefaultTitle(request, pageData) {
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
 * @param {Object} wikiVariables
 * @returns {String} title
 */
export function getCuratedMainPageTitle(request, wikiVariables) {
	/**
	 * Title is double encoded because Ember's RouteRecognizer does decodeURI while processing path.
	 * See the MainPageRoute for more details.
	 */
	if (request.url.path.indexOf('section') > -1) {
		return decodeURIComponent(decodeURI(request.url.path.replace('\/main\/section\/', '')))
			.replace(/%20/g, ' ');
	} else if (request.url.path.indexOf('category') > -1) {
		return decodeURIComponent(decodeURI(request.url.path.replace('\/main\/category\/', '')))
			.replace(/%20/g, ' ');
	} else {
		return wikiVariables.mainPageTitle.replace(/_/g, ' ');
	}
}

/**
 * @param {Hapi.Request} request
 * @param {MediaWikiPageData|CuratedContentPageData} data
 * @returns {object}
 */
export function getBaseResult(request, data) {
	const wikiVariables = data.wikiVariables,
		htmlTitle = wikiVariables.htmlTitle,
		userId = getUserId(request);

	return {
		canonicalUrl: wikiVariables.basePath,
		documentTitle: htmlTitle.parts[0] + htmlTitle.separator + htmlTitle.parts[1],
		gaUserIdHash: gaUserIdHash(userId),
		isRtl: isRtl(wikiVariables),
		// clone object to avoid overriding real localSettings for future requests
		localSettings: getLocalSettings(),
		optimizelyScript: getOptimizelyScriptUrl(request),
		qualarooScript: getQualarooScriptUrl(request),
		server: data.server,
		themeColor: getVerticalColor(wikiVariables.vertical),
		userId,
		wikiVariables
	};
}
