/// <reference path="../../typings/hapi/hapi.d.ts" />
/// <reference path="../../typings/bluebird/bluebird.d.ts" />
/**
 * @description Search controller
 */
import MediaWiki = require('../lib/MediaWiki');
import Promise = require('bluebird');

export function searchWiki(data: any, callback: any, err: any): void {
	var searchReq = new MediaWiki.SearchRequest({
		wikiDomain: data.wikiDomain
	});

	searchReq.searchForQuery(data.query).then((response: any) => {
		// Change hrefs from absolute to relative
		response.items = response.items.map(function (elem: any) {
			elem.url = '/wiki/' + elem.url.substr(elem.url.lastIndexOf('/') + 1);
			return elem;
		});
		callback(response);
	}).catch(err);
}
