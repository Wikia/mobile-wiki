/// <reference path="../../../typings/hapi/hapi.d.ts" />
/// <reference path="../../../typings/boom/boom.d.ts" />
import Boom = require('boom');
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
			wikiDomain: Utils.getCachedWikiDomainName(localSettings, request),
			sectionName: decodeURIComponent(request.params.sectionName) || null
		};

	if (params.sectionName === null) {
		reply(Boom.badRequest('Section not provided'));
	} else {
		new MW.ArticleRequest(params)
			.curatedContentSection(params.sectionName)
			.then((response: any): void => {
				reply(response);
				Caching.setResponseCaching(response, cachingTimes);
			}, (error: any): void => {
				var wrappedResult = wrapResult(error, {});
				reply(wrappedResult).code(wrappedResult.status);
			});
	}
}
