import Caching = require('../../lib/Caching');
import MW = require('../../lib/MediaWiki');
import Utils = require('../../lib/Utils');
import localSettings = require('../../../config/localSettings');
import wrapResult = require('./presenters/wrapResult');

var cachingTimes = {
	enabled: false,
	cachingPolicy: Caching.Policy.Private,
	varnishTTL: Caching.Interval.disabled,
	browserTTL: Caching.Interval.disabled
};

export function get (request: Hapi.Request, reply: any): void {
	var params = {
		wikiDomain: Utils.getCachedWikiDomainName(localSettings, request.headers.host)
	};

	new MW.RandomArticleRequest({
			wikiDomain: params.wikiDomain
		})
		.getRandomArticleName()
		.then((result: any): void => {
			var error = result.exception || null,
				articleId: string;

			// Clean up the result, we need only a title
			if (result.query && result.query.pages) {
				articleId = Object.keys(result.query.pages)[0];
				result = {
					title: result.query.pages[articleId]['title']
				};
			}

			Caching.setResponseCaching(reply(wrapResult(error, result)), cachingTimes);
		})
		.catch((err: any): void => {
			reply(err).code(err.exception.code || 500);
		});
}
