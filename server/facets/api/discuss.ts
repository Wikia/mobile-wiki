import Caching = require('../../lib/Caching');
import MW = require('../../lib/MediaWiki');
import Utils = require('../../lib/Utils');
import Article = require('../../lib/Article');
import localSettings = require('../../../config/localSettings');
import wrapResult = require('./presenters/wrapResult');

var cachingTimes = {
	enabled: false,
	cachingPolicy: Caching.Policy.Private,
	varnishTTL: Caching.Interval.disabled,
	browserTTL: Caching.Interval.disabled
};

export function get (request: Hapi.Request, reply: any): void {
	var wikiDomain = Utils.getCachedWikiDomainName(
			localSettings, request.headers['x-original-host'] || request.headers.host
		),
		url,
		article;

	article = new Article.ArticleRequestHelper({
		wikiDomain: wikiDomain
	});
	article.getWikiVariables((error: any, wikiVariables: any) => {
		if (error) {
			// ???
		} else {
			url = MW.createUrl(localSettings.servicesDomain,
				localSettings.discussion.baseAPIPath + '/' + wikiVariables.id + '/forums',
				request.query);

			MW.fetch(url)
				.then((result: any): void => {
					var error = result.exception || null;
					Caching.setResponseCaching(reply.view('application', context, options));
				})
				.catch((err: any): void => {
					var errorCode = (err && err.exception && err.exception.code) ?
						err.exception.code : 500;
					reply(err).code(errorCode);
				});
		}
	}
}
