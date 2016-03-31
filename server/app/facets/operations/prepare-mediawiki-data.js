import * as Utils from '../../lib/utils';
import {gaUserIdHash} from '../../lib/hashing';
import localSettings from '../../../config/localSettings';
import {
	isRtl, getUserId, getQualarooScriptUrl, getOptimizelyScriptUrl, getOpenGraphData,
	getLocalSettings
} from './prepare-page-data';

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
		result = {
			server: data.server,
			wikiVariables: data.wikiVariables,
			canonicalUrl: '',
			documentTitle: ''
		};

	if (wikiVariables) {
		result.canonicalUrl = wikiVariables.basePath;
	}

	if (pageData && pageData.details) {
		result.canonicalUrl += pageData.details.url;
		result.documentTitle = pageData.details.documentTitle;
	}

	result.isRtl = isRtl(wikiVariables);

	result.themeColor = Utils.getVerticalColor(localSettings, wikiVariables.vertical);
	// the second argument is a whitelist of acceptable parameter names
	result.queryParams = Utils.parseQueryParams(request.query, allowedQueryParams);
	result.openGraph = getOpenGraphData('wiki-page', result.documentTitle, result.canonicalUrl);
	// clone object to avoid overriding real localSettings for future requests
	result.localSettings = getLocalSettings();

	result.qualarooScript = getQualarooScriptUrl(request);
	result.optimizelyScript = getOptimizelyScriptUrl(request);
	result.userId = getUserId(request);
	result.gaUserIdHash = gaUserIdHash(result.userId);

	if (typeof request.query.buckySampling !== 'undefined') {
		result.localSettings.weppy.samplingRate = parseInt(request.query.buckySampling, 10) / 100;
	}

	if (data.page.exception) {
		result.exception = data.page.exception;
	}

	result.asyncArticle = false;

	return result;
}
