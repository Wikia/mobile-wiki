import * as Utils from '../../lib/Utils';
import {gaUserIdHash} from '../../lib/Hashing';
import localSettings from '../../../config/localSettings';
import {isRtl, getUserId, getQualarooScriptUrl, getOpenGraphData, getLocalSettings} from './preparePageData';

/**
 * @param {Object} data
 * @param {Hapi.Request} request
 * @returns {String} title
 */
export function getTitle(data, request) {
	try {
		return data.page.data.nsData.name;
	} catch (e) {
		return request.params.title.replace(/_/g, ' ');
	}
}
/**
 * Prepares article data to be rendered
 *
 * @param {Hapi.Request} request
 * @param {MediaWikiPageData} data
 * @returns {object}
 */
export default function prepareCategoryData(request, data) {
	const allowedQueryParams = ['_escaped_fragment_', 'noexternals', 'buckysampling'],
		wikiVariables = data.wikiVariables,
		articleData = data.page.data,
		result = {
			server: data.server,
			wikiVariables: data.wikiVariables,
		};

	if (articleData && articleData.details) {
		result.canonicalUrl = wikiVariables.basePath + articleData.details.url;
	}

	result.isRtl = isRtl(wikiVariables);

	result.htmlTitle = data.page.data.htmlTitle;
	result.displayTitle = getTitle(data, request);
	result.themeColor = Utils.getVerticalColor(localSettings, wikiVariables.vertical);
	// the second argument is a whitelist of acceptable parameter names
	result.queryParams = Utils.parseQueryParams(request.query, allowedQueryParams);
	result.openGraph = getOpenGraphData('category', result.displayTitle, result.canonicalUrl);
	// clone object to avoid overriding real localSettings for futurue requests
	result.localSettings = getLocalSettings();

	result.qualarooScript = getQualarooScriptUrl(request);
	result.userId = getUserId(request);
	result.gaUserIdHash = gaUserIdHash(result.userId);

	if (typeof request.query.buckySampling !== 'undefined') {
		result.localSettings.weppy.samplingRate = parseInt(request.query.buckySampling, 10) / 100;
	}

	result.asyncArticle = false;
	result.prerenderEnabled = false;

	return result;
}
