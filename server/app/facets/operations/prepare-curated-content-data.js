import {parseQueryParams} from '../../lib/utils';
import {gaUserIdHash} from '../../lib/hashing';
import {isRtl, getUserId, getQualarooScriptUrl, getOptimizelyScriptUrl, getOpenGraphData, getLocalSettings}
	from './page-data-helper';

/**
 * @param {Hapi.Request} request
 * @param {Object} wikiVariables
 * @returns {String} title
 */
export function getTitle(request, wikiVariables) {
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
 * Handles category or section response for Curated Main Page from API
 *
 * @param {Hapi.Request} request
 * @param {CuratedContentPageData} data
 * @returns {Object}
 */
export default function prepareCuratedContentData(request, data) {
	const wikiVariables = data.wikiVariables,
		displayTitle = getTitle(request, wikiVariables),
		userId = getUserId(request),

		result = {
			canonicalUrl: `${wikiVariables.basePath}/`,
			documentTitle: displayTitle,
			displayTitle,
			gaUserIdHash: gaUserIdHash(userId),
			isMainPage: true,
			isRtl: isRtl(wikiVariables),
			// clone object to avoid overriding real localSettings for future requests
			localSettings: getLocalSettings(),
			mainPageData: data.mainPageData,
			optimizelyScript: getOptimizelyScriptUrl(request),
			qualarooScript: getQualarooScriptUrl(request),
			queryParams: parseQueryParams(request.query, ['noexternals', 'buckysampling']),
			server: data.server,
			userId,
			wikiVariables
		};

	if (typeof request.query.buckySampling !== 'undefined') {
		result.localSettings.weppy.samplingRate = parseInt(request.query.buckySampling, 10) / 100;
	}

	result.openGraph = getOpenGraphData('website', result.displayTitle, result.canonicalUrl, result.mainPageData);

	return result;
}
