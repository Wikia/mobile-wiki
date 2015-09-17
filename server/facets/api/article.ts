import Article = require('../../lib/Article');
import Caching = require('../../lib/Caching');
import Utils = require('../../lib/Utils');
import localSettings = require('../../../config/localSettings');
import wrapResult = require('./presenters/wrapResult');

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
	var wrappedResult = wrapResult(result.exception, result.data),
		response = reply(wrappedResult).code(wrappedResult.status);

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
	var wikiDomain = Utils.getCachedWikiDomainName(localSettings, request.headers.host),
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
		article.getArticleRandomTitle((error: any, result: any): void => {
			var wrappedResult = wrapResult(error, result);
			Caching.disableCache(reply(wrappedResult));
		});
		return;
	}

	article
		.getArticle()
		.then((result: any): void => {
			handleArticleResponse(reply, result, allowCache);
		})
		.catch((result: any): void => {
			handleArticleResponse(reply, result, allowCache);
		});
}
