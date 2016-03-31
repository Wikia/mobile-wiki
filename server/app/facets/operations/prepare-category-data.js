import * as Utils from '../../lib/utils';
import {gaUserIdHash} from '../../lib/hashing';
import localSettings from '../../../config/localSettings';
import {isRtl, getUserId, getQualarooScriptUrl, getOptimizelyScriptUrl, getOpenGraphData,
	getLocalSettings} from './prepare-page-data';

/**
 * @param {Object} data
 * @param {Hapi.Request} request
 * @returns {String} title
 */
export function getTitle(data, request) {
	try {
		return data.page.data.details.title;
	} catch (e) {
		return request.params.title.replace(/_/g, ' ');
	}
}
/**
 * @param {Hapi.Request} request
 * @param {MediaWikiPageData} data
 * @returns {object}
 */
export default function prepareCategoryData(request, data) {
	const allowedQueryParams = ['_escaped_fragment_', 'noexternals', 'buckysampling'],
		i18n = request.server.methods.i18n.getInstance(),
		wikiVariables = data.wikiVariables,
		pageData = data.page.data,
		result = {
			server: data.server,
			wikiVariables: data.wikiVariables,
			canonicalUrl: ''
		};

	if (wikiVariables) {
		result.canonicalUrl = wikiVariables.basePath;
	}

	if (pageData && pageData.details) {
		result.canonicalUrl += pageData.details.url;
		result.documentTitle = pageData.details.documentTitle;
	}

	if (pageData) {
		result.htmlTitle = pageData.htmlTitle;
		result.htmlTitle = pageData.htmlTitle;
	} else {
		result.htmlTitle = request.params.title.replace(/_/g, ' ');
	}

	result.isRtl = isRtl(wikiVariables);
	result.displayTitle = getTitle(data, request);
	result.themeColor = Utils.getVerticalColor(localSettings, wikiVariables.vertical);
	// the second argument is a whitelist of acceptable parameter names
	result.queryParams = Utils.parseQueryParams(request.query, allowedQueryParams);
	result.openGraph = getOpenGraphData('category', result.displayTitle, result.canonicalUrl);
	// clone object to avoid overriding real localSettings for futurue requests
	result.localSettings = getLocalSettings();

	result.qualarooScript = getQualarooScriptUrl(request);
	result.optimizelyScript = getOptimizelyScriptUrl(request);
	result.userId = getUserId(request);
	result.gaUserIdHash = gaUserIdHash(result.userId);

	if (typeof request.query.buckySampling !== 'undefined') {
		result.localSettings.weppy.samplingRate = parseInt(request.query.buckySampling, 10) / 100;
	}

	result.asyncArticle = false;

	// Hide TOC on category pages
	result.hasToC = false;
	result.subtitle = i18n.t('app.category-page-subtitle');

	return result;
}
