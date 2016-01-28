import * as Article from '../lib/Article';
import setResponseCaching, * as Caching from '../lib/Caching';
import {getCachedWikiDomainName, getCDNBaseUrl} from '../lib/Utils';
import localSettings from '../../config/localSettings';
import prepareArticleDataToPreview from './operations/prepareArticleDataToPreview';
import Logger from '../lib/Logger';

/**
 * @param {Hapi.Request} request
 * @param {Hapi.Response} reply
 * @returns {void}
 */
export default function editorPreview(request, reply) {
	const wikiDomain = getCachedWikiDomainName(localSettings, request),
		params = {
			wikiDomain,
			wikitext: request.payload.wikitext,
			CKmarkup: request.payload.CKmarkup,
			title: request.payload.title || ''
		},
		article = new Article.ArticleRequestHelper(params);

	article.getArticleFromMarkup()
		/**
		 * @param {*} wikiVariables
		 * @returns {void}
		 */
		.then((payload) => {
			let content = JSON.parse(payload),
				response,
				articleData;

			if (typeof content.data === 'undefined') {
				throw new Error('Bad data received from API');
			}

			articleData = prepareArticleDataToPreview(content.data, content.wikiVariables);

			console.log("articleData.article", articleData.article);

			response = reply.view('article', articleData);
			response.code(200);
			response.type('text/html; charset=utf-8');

			return Caching.disableCache(response);
		})
		/**
		 * @param {*} error
		 * @returns {void}
		 */
		.catch((error) => {
			Logger.error(error);
			reply.view('application', {
				error
			}, {
				layout: 'empty'
			});
		});
}
