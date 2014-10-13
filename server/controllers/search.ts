/// <reference path="../../typings/hapi/hapi.d.ts" />
/// <reference path="../../typings/bluebird/bluebird.d.ts" />
/**
 * @description Search controller
 */
import MediaWiki = require('../lib/MediaWiki');
import Promise = require('bluebird');

export function searchWiki(data: any, callback: (error:any, data: any) => {}): void {
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
