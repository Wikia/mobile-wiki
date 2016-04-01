import localSettings from '../../../config/localSettings';
import {gaUserIdHash} from '../../lib/hashing';
import {parseQueryParams, getVerticalColor} from '../../lib/utils';
import {getTitle, isRtl, getUserId, getQualarooScriptUrl, getOptimizelyScriptUrl, getOpenGraphData, getLocalSettings}
	from './page-data-helper';

/**
 * Sets minimum data that is required to start the Ember app
 *
 * @param {Hapi.Request} request
 * @param {MediaWikiPageData} data
 * @returns {object}
 */
export default function prepareMediaWikiData(request, data) {
	const allowedQueryParams = ['_escaped_fragment_', 'noexternals', 'buckysampling'],
		wikiVariables = data.wikiVariables,
		pageData = data.page.data,
		displayTitle = getTitle(request, wikiVariables),
		userId = getUserId(request),

		result = {
			asyncArticle: false,
			canonicalUrl: wikiVariables.basePath,
			documentTitle: displayTitle,
			displayTitle,
			gaUserIdHash: gaUserIdHash(userId),
			isRtl: isRtl(wikiVariables),
			// clone object to avoid overriding real localSettings for future requests
			localSettings: getLocalSettings(),
			optimizelyScript: getOptimizelyScriptUrl(request),
			qualarooScript: getQualarooScriptUrl(request),
			queryParams: parseQueryParams(request.query, allowedQueryParams),
			server: data.server,
			themeColor: getVerticalColor(localSettings, wikiVariables.vertical),
			userId,
			wikiVariables
		};

	if (pageData && pageData.details) {
		result.canonicalUrl += pageData.details.url;
		result.documentTitle = pageData.details.documentTitle;
	}

	if (data.page.exception) {
		result.exception = data.page.exception;
	}

	if (typeof request.query.buckySampling !== 'undefined') {
		result.localSettings.weppy.samplingRate = parseInt(request.query.buckySampling, 10) / 100;
	}

	result.openGraph = getOpenGraphData('wiki-page', result.displayTitle, result.canonicalUrl);

	return result;
}
