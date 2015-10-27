import Article = require('../../lib/Article');
import Caching = require('../../lib/Caching');
import Utils = require('../../lib/Utils');
import localSettings = require('../../../config/localSettings');
import getStatusCode = require('../operations/getStatusCode');

var cachingTimes = {
		enabled: true,
		cachingPolicy: Caching.Policy.Public,
		varnishTTL: Caching.Interval.standard,
		browserTTL: Caching.Interval.disabled
	};

function isRequestForRandomTitle(query: any): boolean {
	return (typeof query.random !== 'undefined' && typeof query.titleOnly !== 'undefined');
}

function handleArticleResponse(reply: any, result: any, allowCache: boolean): void {
	var response = reply(result).code(getStatusCode(result));

	if (allowCache) {
		return Caching.setResponseCaching(response, cachingTimes);
	}

	Caching.disableCache(response);
}

/**
 * @description Entry point method for getting article API data, a HapiRouteHandler
 *
 * @param {Hapi.Request} request
 * @param reply
 */
export function get(request: Hapi.Request, reply: any): void {
	var wikiDomain = Utils.getCachedWikiDomainName(localSettings, request),
		params: ArticleRequestParams = {
			wikiDomain: wikiDomain,
			title: request.params.articleTitle,
			redirect: request.params.redirect
		},
		article: Article.ArticleRequestHelper,
		allowCache = true;

	if (request.state.wikicities_session) {
		params.headers = {
			'Cookie': `wikicities_session=${request.state.wikicities_session}`
		};
		allowCache = false;
	}

	article = new Article.ArticleRequestHelper(params);

	if (isRequestForRandomTitle(request.query)) {
		article
			.getArticleRandomTitle()
			.then((result: any): void => {
				Caching.disableCache(reply(result));
			})
			.catch((result: any) => {
				Caching.disableCache(reply(result).code(getStatusCode(result)));
			});

		return;
	}

	article
		.getArticle()
		.then((result: any): void => {
			handleArticleResponse(reply, result, allowCache);
		})
		.catch((result: any): void => {
			// We already have the logic to handle rejected promise in handleArticleResponse
			handleArticleResponse(reply, result, allowCache);
		});
}
