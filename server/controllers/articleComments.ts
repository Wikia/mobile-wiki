/// <reference path="../../typings/hapi/hapi.d.ts" />
/**
 * @description ArticleComments controller
 */

import http = require('http');
import mediawiki = require('../lib/mediawiki');

/**
 * @description Handler for /articleComments/{wiki}/{articleId}
 */

export function handleRoute(request: Hapi.Request, reply: any): void {
	mediawiki.articleComments(request.params.wiki, parseInt(request.params.articleId, 10))
	.then(function(response){
		reply(response.body);
	})
	.catch(function(error) {
		reply(error);
	});
}
