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
			wikiDomain: Utils.getCachedWikiDomainName(localSettings, Utils.getHostFromRequest(request)),
			categoryName: decodeURIComponent(request.params.categoryName),
			thumbSize: request.params.thumbSize || {
				width: 300,
				height: 300
			},
			offset: request.query.offset || ''
		};

	if (params.categoryName === null) {
		reply(Boom.badRequest('Category not provided'));
	} else {
		new MW.ArticleRequest(params)
			.category(params.categoryName, params.thumbSize, params.offset)
			.then((response: any): void => {
				reply(response);
				Caching.setResponseCaching(response, cachingTimes);
			}, (error: any): void => {
				var preparedResult: any = wrapResult(error, {});
				reply(preparedResult).code(preparedResult.status);
			});
	}
}
