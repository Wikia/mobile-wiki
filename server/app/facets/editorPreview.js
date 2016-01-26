import * as Article from '../lib/Article';
import {getCachedWikiDomainName, getCDNBaseUrl} from '../lib/Utils';
import localSettings from '../../config/localSettings';
import prepareArticleDataToPreview from './operations/prepareArticleDataToPreview';
import setResponseCaching, * as Caching from '../lib/Caching';
import Logger from '../lib/Logger';
import * as Tracking from '../lib/Tracking';

/**
 * @param {Hapi.Request} request
 * @param {Hapi.Response} reply
 * @returns {void}
 */
export default function editorPreview(request, reply) {
	const wikiDomain = getCachedWikiDomainName(localSettings, request),
		params = {
			wikiDomain,
			wikitext: decodeURIComponent(request.payload.wikitext) || false,
			CKmarkup: decodeURIComponent(request.payload.CKmarkup) || false,
			title: request.payload.title || ''
		},
		article = new Article.ArticleRequestHelper(params);

	article.getArticleFromMarkup()
		/**
		 * @param {*} wikiVariables
		 * @returns {void}
		 */
		.then((content) => {
			let result,
				response,
				articleData;

			if ( content.data === undefined) {
				throw new Error('Bad data received from API');
			}

			console.log("content.data", content.data)
			console.log("content.wikiVariables", content.wikiVariables)

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
				wikiVariables: content.wikiVariables || {},
				server: {
					cdnBaseUrl: getCDNBaseUrl(localSettings)
				}
			};

			articleData = prepareArticleDataToPreview(request, result);

			// @todo why is this needed for the images to load?
			result.tracking = localSettings.tracking;

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
