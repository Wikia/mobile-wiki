import {getOpenGraphData, getOpenGraphUrl} from './page-data-helper';

/**
 * Prepares main page data to be rendered
 *
 * @param {MediaWikiPageData} data
 * @returns {object}
 */
export default function prepareMainPageData(data) {
	const pageData = data.page.data,
		wikiVariables = data.wikiVariables,
		result = {
			hasToC: false,
			openGraph: getOpenGraphData('website', wikiVariables.siteName, getOpenGraphUrl(wikiVariables)),
			mainPageData: {
				adsContext: pageData.adsContext
			}
		};

	if (pageData.details) {
		if (pageData.details.description) {
			result.description = pageData.details.description;
		}

		if (pageData.details.ns) {
			result.mainPageData.ns = pageData.details.ns;
		}
	}

	return result;
}
