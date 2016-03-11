import {parseQueryParams} from '../../lib/Utils';
import {gaUserIdHash} from '../../lib/Hashing';
import {isRtl, getUserId, getQualarooScriptUrl, getOptimizelyScriptUrl, getOpenGraphData,
	getLocalSettings} from './preparePageData';

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
 * @param {CuratedContentPageData} curatedContentPageData
 * @returns {Object}
 */
export default function prepareCuratedContentData(request, curatedContentPageData) {
	const result = {
			mainPageData: curatedContentPageData.mainPageData,
			wikiVariables: curatedContentPageData.wikiVariables,
			server: curatedContentPageData.server
		},
		wikiVariables = result.wikiVariables;

	result.isRtl = isRtl(wikiVariables);

	result.displayTitle = getTitle(request, wikiVariables);
	result.isMainPage = true;
	result.canonicalUrl = `${wikiVariables.basePath}/`;
	result.queryParams = parseQueryParams(request.query, ['noexternals', 'buckysampling']);

	result.openGraph = getOpenGraphData('website', wikiVariables.siteName, result.canonicalUrl, result.mainPageData);
	// clone object to avoid overriding real localSettings for future requests
	result.localSettings = getLocalSettings();

	if (typeof request.query.buckySampling !== 'undefined') {
		result.localSettings.weppy.samplingRate = parseInt(request.query.buckySampling, 10) / 100;
	}

	result.userId = getUserId(request);
	result.gaUserIdHash = gaUserIdHash(result.userId);

	result.qualarooScript = getQualarooScriptUrl(request);
	result.optimizelyScript = getOptimizelyScriptUrl(request);

	return result;
}
