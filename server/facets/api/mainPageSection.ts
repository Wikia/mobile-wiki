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
			sectionName: decodeURIComponent(request.params.sectionName) || null
		};

	new MW.ArticleRequest(params)
		.curatedContentSection(params.sectionName)
		.then((response: any): void => {
			reply(response);
		})
		.catch((error: any): void => {
			reply(error).code(getStatusCode(error));
		});
}
