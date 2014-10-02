/// <reference path="../../typings/hapi/hapi.d.ts" />
/// <reference path="../../typings/bluebird/bluebird.d.ts" />
/**
 * @description Search controller
 */
import MediaWiki = require('../lib/MediaWiki');
import Promise = require('bluebird');

export function searchWiki(data: any, callback: any, err: any) {
	var searchReq = new MediaWiki.SearchRequest({
		name: data.wikiName
	});

	searchReq.searchForQuery(data.query)
		.then(callback)
		.catch(err);
}
