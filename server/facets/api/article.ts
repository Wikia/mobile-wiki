import Article = require('../../lib/Article');
import Caching = require('../../lib/Caching');
import Utils = require('../../lib/Utils');
import localSettings = require('../../../config/localSettings');
import wrapResult = require('./presenters/wrapResult');

var cachingTimes = {
		enabled: true,
		cachingPolicy: Caching.Policy.Public,
		varnishTTL: Caching.Interval.standard,
		browserTTL: Caching.Interval.default
	},
	randomTitleCachingTimes = {
		enabled: false,
		cachingPolicy: Caching.Policy.Private,
		varnishTTL: Caching.Interval.disabled,
		browserTTL: Caching.Interval.disabled
	};

function isRequestForRandomTitle (query: any): boolean {
	return (typeof query.random !== 'undefined' && typeof query.titleOnly !== 'undefined');
}

/**
 * get
 * @description Entry point method for getting article API data, a HapiRouteHandler
 * @param {Hapi.Request} request
 * @param reply
 * @param error
 * @param result
 */
export function get (request: Hapi.Request,  reply: any): void {
	var wikiDomain = Utils.getCachedWikiDomainName(localSettings, request.headers.host);

	if (isRequestForRandomTitle(request.query)) {
		Article.getArticleRandomTitle(wikiDomain, (error: any, result: any): void => {
			wrapResult(error, result);
			Caching.setResponseCaching(reply(result), randomTitleCachingTimes);
		});
		return;
	}

	Article.getData({
		wikiDomain: wikiDomain,
		title: request.params.articleTitle,
		redirect: request.params.redirect
	}, (error: any, result: any): void => {
		// TODO: Consider normalizing all error handling to Boom
		wrapResult(error, result);
		Caching.setResponseCaching(reply(result).code(result.status), cachingTimes);
	});
}
