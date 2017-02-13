import {reach} from 'hoek';

/**
 * @param {MediaWikiPageData} data
 * @returns {object}
 */
export default function (data) {
	const result = {},
		categoryData = reach(data, 'page.data.nsSpecificContent');

	if (categoryData && categoryData.nextPageUrl) {
		result.nextPageUrl = categoryData.nextPageUrl;
	}

	if (categoryData && categoryData.prevPageUrl) {
		result.prevPageUrl = categoryData.prevPageUrl;
	}

	return result;
}
