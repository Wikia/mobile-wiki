import {parseQueryParams} from '../../lib/Utils';
import localSettings from '../../../config/localSettings';
import deepExtend from 'deep-extend';

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

	let title,
		contentDir = 'ltr',
		mainPageDetails;

	/**
	 * Title is double encoded because Ember's RouteRecognizer does decodeURI while processing path.
	 * See the MainPageRoute for more details.
	 */
	if (request.url.path.indexOf('section') > -1) {
		title = decodeURIComponent(decodeURI(request.url.path.replace('\/main\/section\/', '')))
			.replace(/%20/g, ' ');
	} else if (request.url.path.indexOf('category') > -1) {
		title = decodeURIComponent(decodeURI(request.url.path.replace('\/main\/category\/', '')))
			.replace(/%20/g, ' ');
	} else {
		title = wikiVariables.mainPageTitle.replace(/_/g, ' ');
	}

	if (wikiVariables.language) {
		contentDir = wikiVariables.language.contentDir;
		result.isRtl = (contentDir === 'rtl');
	}

	result.displayTitle = title;
	result.isMainPage = true;
	result.canonicalUrl = `${wikiVariables.basePath}/`;
	result.queryParams = parseQueryParams(request.query, ['noexternals', 'buckysampling']);
	result.openGraph = {
		type: 'website',
		title: wikiVariables.siteName,
		url: result.canonicalUrl
	};

	if (result.mainPageData && result.mainPageData.details) {
		mainPageDetails = result.mainPageData.details;
		result.mainPageData.ns = mainPageDetails.ns;

		if (mainPageDetails.abstract) {
			result.openGraph.description = mainPageDetails.abstract;
		}

		if (mainPageDetails.thumbnail) {
			result.openGraph.image = mainPageDetails.thumbnail;
		}
	}

	// clone object to avoid overriding real localSettings for futurue requests
	result.localSettings = deepExtend({}, localSettings);

	if (typeof request.query.buckySampling !== 'undefined') {
		result.localSettings.weppy.samplingRate = parseInt(request.query.buckySampling, 10) / 100;
	}

	result.userId = request.state.wikicitiesUserID ? request.state.wikicitiesUserID : 0;

	// all the third party scripts we don't want to load on noexternals
	if (!result.queryParams.noexternals) {
		// qualaroo
		if (localSettings.qualaroo.enabled) {
			result.qualarooScript = localSettings.qualaroo.scriptUrl;
		}
	}

	return result;
}
