import * as Article from '../lib/Article';
import {getCachedWikiDomainName, getCDNBaseUrl} from '../lib/Utils';
import localSettings from '../../config/localSettings';
import prepareArticleData from './operations/prepareArticleData';
import setResponseCaching, * as Caching from '../lib/Caching';

/**
 * @param {Hapi.Request} request
 * @param {Hapi.Response} reply
 * @returns {void}
 */
export default function CKpreview(request, reply) {
	const wikiDomain = getCachedWikiDomainName(localSettings, request),
		wikitext = request.payload.wikitext,
		article = new Article.ArticleRequestHelper({wikiDomain});

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

			articleData = prepareArticleData(request, result);

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
			console.log("errorroroororororor! : ", error)
			reply.view('application', {
				error
			}, {
				layout: 'empty'
			});
		});
}
