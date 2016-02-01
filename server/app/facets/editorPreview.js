import * as Article from '../lib/Article';
import disableCache from '../lib/Caching';
import {getCachedWikiDomainName, getCDNBaseUrl, getHtmlTitle} from '../lib/Utils';
import localSettings from '../../config/localSettings';
import Logger from '../lib/Logger';
import deepExtend from 'deep-extend';

/**
 * Prepares article data to be rendered
 * in the editor preview mode
 *
 * @param {string} title title of article to preview
 * @param {ArticlePageData} article
 * @param {object} wikiVariables
 * @returns {object}
 */
function prepareArticleDataToPreview(title, article, wikiVariables = {}) {
	return {
		article: {
			data: {
				article: {
					media: article.media
				},
				details: {
					ns: 0,
					title,
					revision: {},
					type: 'article',
					comments: 0
				}
			},
			adsContext: {},
			htmlTitle: ''
		},
		articleContent: article.content,
		wikiVariables,
		htmlTitle: getHtmlTitle(wikiVariables, title),
		// required in server-data.hbs
		userId: 0,
		server: {
			cdnBaseUrl: getCDNBaseUrl(localSettings)
		},
		// required for UniversalAnalytics to work
		tracking: localSettings.tracking,
		// clone object to avoid overriding real localSettings for future requests
		localSettings: deepExtend({}, localSettings),
		isRtl: wikiVariables.language && wikiVariables.language.contentDir === 'rtl',
		preview: true
	};
}

/**
 * @param {Hapi.Request} request
 * @param {Hapi.Response} reply
 * @returns {void}
 */
export default function editorPreview(request, reply) {
	const wikiDomain = getCachedWikiDomainName(localSettings, request),
		params = {
			wikiDomain,
			wikitext: request.payload.wikitext || '',
			CKmarkup: request.payload.CKmarkup || '',
			title: request.payload.title || ''
		},
		article = new Article.ArticleRequestHelper(params);

	article.getArticleFromMarkup()
		.then((payload) => {
			const content = JSON.parse(payload);
			let articleData,
				response;

			if (typeof content.data === 'undefined' || typeof content.data.article === 'undefined') {
				throw new Error('Invalid payload received from API: ', content);
			}

			articleData = prepareArticleDataToPreview(request.payload.title, content.data.article, content.wikiVariables);

			response = reply.view('article', articleData);
			response.code(200);
			response.type('text/html; charset=utf-8');

			return disableCache(response);
		})
		/**
		 * @param {*} error
		 * @returns {void}
		 */
		.catch((error) => {
			Logger.error(error);
			reply.view('error');
		});
}
