import * as Utils from '../../lib/Utils';
import localSettings from '../../../config/localSettings';
import deepExtend from 'deep-extend';
import {getCachedWikiDomainName, getCDNBaseUrl} from '../../lib/Utils';

/**
 * Prepares article preview data to be rendered in preview window
 *
 * @param {object} data
 * @param {object} wikiVariables
 * @returns {object}
 */
export default function prepareArticleDataToPreview(data, wikiVariables = {}) {
	let title,
		contentDir = 'ltr',
		result = {
			article: {
				data: data,
				adsContext: {},
				details: {
					ns: 0,
					id: 0,
					title: '',
					revision: {},
					type: 'article',
					comments: 0,
					user: 0
				},
				isMainPage: 'false',
				htmlTitle: '',
				preview: true
			},
			wikiVariables: wikiVariables,
			userId: 0,
			server: {
				cdnBaseUrl: getCDNBaseUrl(localSettings)
			},
			//required for UniversalAnalytics to work
			tracking: localSettings.tracking
		};

	if (data.article) {
		title = data.article.displayTitle || '';
		// we want to return the article content only once - as HTML and not JS variable
		// and it will be displayed in article view and then replaced on fronted during the model creation
		result.articleContent = data.article.content;
		delete data.article.content;
	}

	if (wikiVariables.language) {
		contentDir = wikiVariables.language.contentDir;
		result.isRtl = (contentDir === 'rtl');
	}

	result.displayTitle = title || '';
	result.htmlTitle = Utils.getHtmlTitle(wikiVariables, title);

	// clone object to avoid overriding real localSettings for future requests
	result.localSettings = deepExtend({}, localSettings);

	return result;
}
