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

	searchReq.searchForQuery(data.query).then((response: any) => {
		// Change hrefs from absolute to relative
		response.items = response.items.map(function (elem) {
			elem.url = '/wiki/' + elem.url.substr(elem.url.lastIndexOf('/') + 1);
			return elem;
		});
		callback(response);
	}).catch(err);
}
