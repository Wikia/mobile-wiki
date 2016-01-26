import * as Utils from '../../lib/Utils';
import localSettings from '../../../config/localSettings';
import deepExtend from 'deep-extend';

/**
 * Prepares article preview data to be rendered in preview window
 *
 * @param {Hapi.Request} request
 * @param {ArticlePageData} data
 * @returns {object}
 */
export default function prepareArticleDataToPreview(request, data) {
	const allowedQueryParams = ['_escaped_fragment_', 'noexternals', 'buckysampling'],
		articleData = data.article.data,
		wikiVariables = data.wikiVariables,
		result = {
			article: data.article,
			server: data.server,
			wikiVariables: data.wikiVariables,
			isMainPage: false
		};

	let title,
		contentDir = 'ltr';

	if (articleData) {
		title = articleData.article.displayTitle || '';

		if (articleData.article) {
			// we want to return the article content only once - as HTML and not JS variable
			result.articleContent = articleData.article.content;
			delete articleData.article.content;
		}
	}

	if (wikiVariables.language) {
		contentDir = wikiVariables.language.contentDir;
		result.isRtl = (contentDir === 'rtl');
	}

	result.displayTitle = title || '';
	result.htmlTitle = Utils.getHtmlTitle(wikiVariables, title);
	result.themeColor = Utils.getVerticalColor(localSettings, wikiVariables.vertical);
	// the second argument is a whitelist of acceptable parameter names
	result.queryParams = Utils.parseQueryParams(request.query, allowedQueryParams);

	// clone object to avoid overriding real localSettings for futurue requests
	result.localSettings = deepExtend({}, localSettings);
	result.userId = request.auth.isAuthenticated ? request.auth.credentials.userId : 0;

	return result;
}
