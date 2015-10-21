/// <reference path="../../../typings/hapi/hapi.d.ts" />
/// <reference path="../../../typings/boom/boom.d.ts" />
import Boom = require('boom');
import MW = require('../../lib/MediaWiki');
import Utils = require('../../lib/Utils');
import localSettings = require('../../../config/localSettings');
import getStatusCode = require('../operations/getStatusCode');

export function get(request: Hapi.Request, reply: any): void {
	var params = {
			wikiDomain: Utils.getCachedWikiDomainName(localSettings, request),
			categoryName: decodeURIComponent(request.params.categoryName),
			thumbSize: request.params.thumbSize || {
				width: 300,
				height: 300
			},
			offset: request.query.offset || ''
		};

	new MW.ArticleRequest(params)
		.category(params.categoryName, params.thumbSize, params.offset)
		.then(reply)
		.catch((error: any): void => {
			reply(error).code(getStatusCode(error));
		});
}
