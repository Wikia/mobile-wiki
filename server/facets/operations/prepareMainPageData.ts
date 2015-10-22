/**
 * Prepares main page data to be rendered
 *
 * @param {ArticlePageData} data
 * @returns {object}
 */
function prepareMainPageData(data: ArticlePageData): any {
	var articleData: ArticleData = data.article.data,
		wikiVariables = data.wikiVariables,
		result: any = {},
		title = wikiVariables.siteName;

	result.mainPageData = {};
	result.mainPageData.adsContext = articleData.adsContext;
	result.mainPageData.ns = articleData.details.ns;

	result.htmlTitle = Utils.getHtmlTitle(result, '');
	result.openGraph = {
		type: 'website',
		title: title,
		url: wikiVariables.basePath + wikiVariables.articlePath + title.replace(/ /g, '_')
	};

	return result;
}

export = prepareMainPageData;
