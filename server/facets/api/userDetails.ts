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
	var wikiDomain = Utils.getCachedWikiDomainName(
			localSettings, request.headers['x-original-host'] || request.headers.host
		),
		url = MW.createUrl(wikiDomain, 'api/v1/User/Details', request.query);

	MW.fetch(url, wikiDomain)
		.then((result: any): void => {
			var error = result.exception || null;
			Caching.setResponseCaching(reply(wrapResult(error, result)), cachingTimes);
		})
		.catch((err: any): void => {
			var errorCode = (err && err.exception && err.exception.code) ?
				err.exception.code : 500;
			reply(err).code(errorCode);
		});
}
