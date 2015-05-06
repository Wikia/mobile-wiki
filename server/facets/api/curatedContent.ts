/// <reference path="../../../typings/hapi/hapi.d.ts" />
/// <reference path="../../../typings/boom/boom.d.ts" />
import Boom = require('boom');
import Caching = require('../../lib/Caching');
import MW = require('../../lib/MediaWiki');
import Utils = require('../../lib/Utils');
import localSettings = require('../../../config/localSettings');
import wrapResult = require('./presenters/wrapResult');

interface CuratedContentSectionMW {
	items: {
		title: string;
		label: string;
		image_id: string;
		article_id: string;
		type: string;
		image_url: string;
		article_local_url: string
	};
}

var cachingTimes = {
	enabled: false,
	cachingPolicy: Caching.Policy.Private,
	varnishTTL: Caching.Interval.disabled,
	browserTTL: Caching.Interval.disabled
};

/**
 * @param itemsData
 * @returns itemsData with status code
 */
function transformResponse (itemsData: CuratedContentSectionMW): CuratedContentSectionMW {
	return itemsData;
}

export function get (request: Hapi.Request, reply: any): void {
	var params = {
			wikiDomain: Utils.getCachedWikiDomainName(localSettings, request.headers.host),
			sectionName: request.params.sectionName || null
		};

	if (params.sectionName === null) {
		// TODO: ad hoc error handling, use Boom everywhere?
		reply(Boom.badRequest('Section not provided'));
	} else {
		new MW.ArticleRequest(params.wikiDomain).curatedContentSection(params.sectionName)
		.then((response: any): void => {
			reply(transformResponse(response));
			Caching.setResponseCaching(response, cachingTimes);
		}, (error: any): void => {
			var preparedResult: any = wrapResult(error, {});
			reply(preparedResult).code(preparedResult.status);
		});
	}
}
