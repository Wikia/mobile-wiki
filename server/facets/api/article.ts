import Article = require('../../lib/Article');
import Caching = require('../../lib/Caching');
import Utils = require('../../lib/Utils');
import localSettings = require('../../../config/localSettings');
import wrapResult = require('./presenters/resultWrapper');

var cacheOptions = {
	enabled: false,
	cachingPolicy: Caching.Policy.Private,
	varnishTTL: Caching.Interval.standard,
	browserTTL: Caching.Interval.default
};

/**
 * get
 * @description Entry point method for getting article API data, a HapiRouteHandler
 * @param {Hapi.Request} request
 * @param reply
 * @param error
 * @param result
 */
export function get (request: Hapi.Request,  reply: any): void {
	Article.getData({
		wikiDomain: Utils.getCachedWikiDomainName(localSettings, request.headers.host),
		title: request.params.articleTitle,
		redirect: request.params.redirect
	}, (error: any, result: any) => {
		// TODO: Consider normalizing all error handling to Boom
		wrapResult(error, result);
		Caching.setResponseCaching(reply(result).code(result.status), cacheOptions);
	});
}
