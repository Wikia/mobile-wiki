import localSettings from '../../../config/localSettings';
import {gaUserIdHash} from '../../lib/hashing';
import {parseQueryParams, getVerticalColor} from '../../lib/utils';
import {getTitle, isRtl, getUserId, getQualarooScriptUrl, getOptimizelyScriptUrl, getOpenGraphData, getLocalSettings}
	from './page-data-helper';

/**
 * @param {Hapi.Request} request
 * @param {MediaWikiPageData} data
 * @returns {object}
 */
export default function prepareCategoryData(request, data) {
	const allowedQueryParams = ['_escaped_fragment_', 'noexternals', 'buckysampling'],
		pageData = data.page.data,
		wikiVariables = data.wikiVariables,
		displayTitle = getTitle(request, pageData),
		i18n = request.server.methods.i18n.getInstance(),
		userId = getUserId(request),

		result = {
			asyncArticle: false,
			canonicalUrl: wikiVariables.basePath,
			documentTitle: displayTitle,
			displayTitle,
			gaUserIdHash: gaUserIdHash(userId),
			hasToC: false,
			isRtl: isRtl(wikiVariables),
			// clone object to avoid overriding real localSettings for future requests
			localSettings: getLocalSettings(),
			optimizelyScript: getOptimizelyScriptUrl(request),
			qualarooScript: getQualarooScriptUrl(request),
			queryParams: parseQueryParams(request.query, allowedQueryParams),
			server: data.server,
			subtitle: i18n.t('app.category-page-subtitle'),
			themeColor: getVerticalColor(localSettings, wikiVariables.vertical),
			userId,
			wikiVariables
		};

	if (pageData && pageData.details) {
		result.canonicalUrl += pageData.details.url;
		result.documentTitle = pageData.details.documentTitle;
	}

	if (typeof request.query.buckySampling !== 'undefined') {
		result.localSettings.weppy.samplingRate = parseInt(request.query.buckySampling, 10) / 100;
	}

	result.openGraph = getOpenGraphData('category', result.displayTitle, result.canonicalUrl);

	return result;
}
