/**
 * Prepares file data to be rendered
 *
 * @param {Hapi.Request} request
 * @param {MediaWikiPageData} data
 * @returns {object}
 */
export default function prepareFileData(request, data) {
	const pageData = data.page.data,
		result = {};

	if ( pageData && pageData.nsSpecificContent && pageData.nsSpecificContent.fileUsageList ) {
		result.fileUsageList = pageData.nsSpecificContent.fileUsageList;
		result.fileUsageListSeeMoreUrl = pageData.nsSpecificContent.fileUsageListSeeMoreUrl;
	}

	return result;
}
