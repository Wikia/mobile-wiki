import {parseQueryParams} from '../../lib/utils';
import {getDisplayTitle, getBaseResult, getOpenGraphData} from './page-data-helper';
import {namespaceSubtitleMessageKeys} from '../../lib/mediawiki-namespace';

/**
 * Prepares article data to be rendered
 *
 * @param {Hapi.Request} request
 * @param {MediaWikiPageData} data
 * @returns {object}
 */
export default function prepareWikiPageData(request, data) {
	const allowedQueryParams = ['noexternals', 'buckysampling'],
		pageData = data.page.data,
		separator = data.wikiVariables.htmlTitle.separator,
		result = getBaseResult(request, data);

	result.displayTitle = getDisplayTitle(request, pageData);

	result.subtitle = namespaceSubtitleMessageKeys[pageData.ns] ?
		request.server.methods.i18n.getInstance().t(namespaceSubtitleMessageKeys[pageData.ns]) :
		null;

	result.articlePage = data.page;
	result.queryParams = parseQueryParams(request.query, allowedQueryParams);

	if (pageData) {
		result.isMainPage = pageData.isMainPage;

		if (pageData.details) {
			result.canonicalUrl += pageData.details.url;
			result.description = pageData.details.description;
		}

		if (pageData.article) {
			result.articleContent = pageData.article.content;
			delete pageData.article.content;

			// find article's hero image
			if (pageData.article.media) {
				pageData.article.media.forEach((current) => {
					if (current.hasOwnProperty('context') && current.context === 'infobox-hero-image') {
						result.hasHeroImage = true;
					}
				});
			}
		}
	}

	result.htmlTitle = (pageData && pageData.htmlTitle) ?
		pageData.htmlTitle + separator + result.wikiHtmlTitle :
		result.wikiHtmlTitle;

	if (typeof request.query.buckySampling !== 'undefined') {
		result.settings.weppy.samplingRate = parseInt(request.query.buckySampling, 10) / 100;
	}

	result.openGraph = getOpenGraphData('article', result.displayTitle, result.canonicalUrl, pageData);

	return result;
}
