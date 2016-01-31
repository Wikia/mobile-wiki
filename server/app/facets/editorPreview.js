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
 * @param {ArticlePageData} data
 * @param {object} wikiVariables
 * @returns {object}
 */
function prepareArticleDataToPreview(title, data, wikiVariables = {}) {
	let contentDir = 'ltr';
	const result = {
		article: {
			data,
			adsContext: {},
			htmlTitle: ''
		},
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
		preview: true
	};

	result.article.data.details = {
		ns: 0,
		title,
		revision: {},
		type: 'article',
		comments: 0
	};

	if (data.article) {
		// we want to return the article content only once - as HTML and not JS variable
		// and it will be displayed in article view and then replaced on fronted during the model creation
		result.articleContent = data.article.content;

		delete data.article.content;
	}

	if (wikiVariables.language) {
		contentDir = wikiVariables.language.contentDir;
		result.isRtl = (contentDir === 'rtl');
	}

	return result;
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
		/**
		 * @param {*} wikiVariables
		 * @returns {void}
		 */
		.then((payload) => {
			const content = JSON.parse(payload);
			let articleData,
				response;

			if (typeof content.data === 'undefined') {
				throw new Error('Invalid payload received from API: ', content);
			}

			articleData = prepareArticleDataToPreview(request.payload.title, content.data, content.wikiVariables);

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
