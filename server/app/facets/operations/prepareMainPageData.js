/**
 * Prepares main page data to be rendered
 *
 * @param {ArticlePageData} data
 * @returns {object}
 */
export default function prepareMainPageData(data) {
	const articleData = data.article.data,
		wikiVariables = data.wikiVariables,
		result = {},
		title = wikiVariables.siteName;

	result.mainPageData = {};
	result.mainPageData.adsContext = articleData.adsContext;
	result.mainPageData.ns = articleData.details.ns;

	result.openGraph = {
		type: 'website',
		title,
		url: wikiVariables.basePath + wikiVariables.articlePath + title.replace(/ /g, '_')
	};

	return result;
}
