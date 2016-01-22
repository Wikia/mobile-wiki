import * as Article from '../lib/Article';
import {forbidden} from 'boom';
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

	article.getWikiVariables()
		/**
		 * @param {*} wikiVariables
		 * @returns {void}
		 */
		.then((wikiVariables) => {
			let article = {},
				result,
				response;

			article = JSON.parse(wikitext);

			//result = {
			//	article: {
			//		article,
			//		adsContext: {},
			//		details: {
			//			id: 0,
			//			title: '',
			//			revision: {},
			//			type: 'article'
			//		},
			//		htmlTitle: '',
			//		preview: true
			//	},
			//	wikiVariables: wikiVariables || {},
			//	// @todo copied from Article.ts (move createServerData to prepareArticleData?)
			//	server: {
			//		cdnBaseUrl: getCDNBaseUrl(localSettings)
			//	}
			//};

			result = {
				article: article
			};

			//prepareArticleData(request, result);

			//response = reply.view('application', result);
			response.code(code);
			response.type('text/html; charset=utf-8');

			return Caching.disableCache(response);

			//reply.view('application', result);
		})
		/**
		 * @param {*} error
		 * @returns {void}
		 */
		.catch((error) => {
			reply.view('application', {
				error
			}, {
				layout: 'empty'
			});
		});
}
