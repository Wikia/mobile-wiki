import * as Article from '../lib/Article';
import {getCachedWikiDomainName, getCDNBaseUrl} from '../lib/Utils';
import localSettings from '../../config/localSettings';
import prepareArticleDataToPreview from './operations/prepareArticleDataToPreview';
import setResponseCaching, * as Caching from '../lib/Caching';

/**
 * @param {Hapi.Request} request
 * @param {Hapi.Response} reply
 * @returns {void}
 */
export default function editorPreview(request, reply) {
	const wikiDomain = getCachedWikiDomainName(localSettings, request),
		wikitext = request.payload.wikitext,
		title = request.payload.title,
		params = {
			wikiDomain,
			wikitext: request.payload.wikitext || '',
			title: request.payload.title || ''
		},
		article = new Article.ArticleRequestHelper(params);

	article.getArticleFromWikitext()
		/**
		 * @param {*} wikiVariables
		 * @returns {void}
		 */
		.then((content) => {
			let result,
				response,
				articleData;

			result = {
				article: {
					data: content.data,
					adsContext: {},
					details: {
						id: 0,
						title: '',
						revision: {},
						type: 'article'
					},
					htmlTitle: '',
					preview: true
				},
				wikiVariables: content.wikiVariables || {}
			};

			articleData = prepareArticleDataToPreview(request, result);

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
