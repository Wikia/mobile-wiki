import {PageRequestHelper} from '../lib/mediawiki-page';
import {disableCache} from '../lib/caching';
import {getCachedWikiDomainName, getCDNBaseUrl} from '../lib/utils';
import settings from '../../config/settings';
import Logger from '../lib/logger';
import deepExtend from 'deep-extend';

/**
 * Prepares article data to be rendered
 * in the editor preview mode
 *
 * @param {string} title title of article to preview
 * @param {MediaWikiPageData} article
 * @param {Object} [wikiVariables={}]
 * @returns {Object}
 */
function prepareArticleDataToPreview(title, article, wikiVariables = {}) {
	return {
		articlePage: {
			data: {
				article: {
					media: article.media
				},
				ns: 0,
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
		mediaWikiNamespace: 0,
		articleContent: article.content,
		wikiVariables,
		htmlTitle: 'Article preview | Fandom powered by Wikia',
		// required in server-data.hbs
		userId: 0,
		server: {
			cdnBaseUrl: getCDNBaseUrl(settings)
		},
		// required for UniversalAnalytics to work
		tracking: settings.tracking,
		// clone object to avoid overriding real settings for future requests
		settings: deepExtend({}, settings),
		isRtl: wikiVariables.language && wikiVariables.language.contentDir === 'rtl',
		preview: true
	};
}

/**
 * @param {Hapi.Request} request
 * @param {Hapi.Response} reply
 * @returns {void}
 */
export default function articlePreview(request, reply) {
	const wikiDomain = getCachedWikiDomainName(settings, request),
		params = {
			wikiDomain,
			wikitext: request.payload.wikitext || '',
			CKmarkup: request.payload.CKmarkup || '',
			title: request.payload.title || ''
		},
		mediaWikiPageHelper = new PageRequestHelper(params);

	mediaWikiPageHelper
		.getArticleFromMarkup()
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
			reply.view('article-preview-error');
		});
}
