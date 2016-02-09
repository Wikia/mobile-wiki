import {parseQueryParams} from '../../lib/Utils';
import {gaUserIdHash} from '../../lib/Hashing';
import localSettings from '../../../config/localSettings';
import {isRtl, getUserId, getQualarooScriptUrl, getOpenGraphData, getLocalSettings} from './preparePageData';

/**
 * Handles category or section response for Curated Main Page from API
 * @todo XW-608 - remove spaghetti code in prepareCuratedContentData and prepareArticleData
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

	result.userId = getUserId(request);
	result.gaUserIdHash = gaUserIdHash(result.userId);

	result.qualarooScript = getQualarooScriptUrl(request);

	return result;
}

function getTitle(request, wikiVariables) {
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
