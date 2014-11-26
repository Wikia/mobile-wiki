/// <reference path="../../typings/hapi/hapi.d.ts" />
/// <reference path="../../typings/bluebird/bluebird.d.ts" />
/// <reference path="../../typings/mercury/mercury-server.d.ts" />
/**
 * @description Search controller
 */
import MediaWiki = require('../lib/MediaWiki');
import Promise = require('bluebird');

/**
 * Get search suggestions
 *
 * @param data Request params
 * @param callback
 */
export function searchWiki(data: SearchRequestParams, callback: (error: any, data: any) => void): void {
	var searchReq = new MediaWiki.SearchRequest({
		wikiDomain: data.wikiDomain
	});

	searchReq.searchForQuery(data.query)
		.then((searchResults: any) => {
			callback(null, searchResults);
		})
		.catch((err: any) => {
			callback(err, null);
		});
}
