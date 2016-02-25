import * as Utils from '../../lib/Utils';
import {gaUserIdHash} from '../../lib/Hashing';
import localSettings from '../../../config/localSettings';
import {isRtl, getUserId, getQualarooScriptUrl, getOpenGraphData, getLocalSettings} from './preparePageData';

/**
 * Prepares article data to be rendered
 *
 * @param {Hapi.Request} request
 * @param {MediaWikiPageData} data
 * @returns {object}
 */
export default function prepareMediaWikiData(request, data) {
	const allowedQueryParams = ['_escaped_fragment_', 'noexternals', 'buckysampling'],
		wikiVariables = data.wikiVariables,
		result = {
			articlePage: data.page,
			server: data.server,
			wikiVariables: data.wikiVariables,
		};

	result.isRtl = isRtl(wikiVariables);

	result.htmlTitle = Utils.getHtmlTitle(wikiVariables, result.displayTitle);
	result.themeColor = Utils.getVerticalColor(localSettings, wikiVariables.vertical);
	// the second argument is a whitelist of acceptable parameter names
	result.queryParams = Utils.parseQueryParams(request.query, allowedQueryParams);
	result.openGraph = getOpenGraphData('article', result.displayTitle, result.canonicalUrl);
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
