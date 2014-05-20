/// <reference path="../../definitions/hapi/hapi.d.ts" />
/**
 * @description Article controller
 */

import http = require('http');
import mediawiki = require('../lib/medawiki');

/**
 * @description Handler for /article/{wiki}/{articleId} -- Currently calls to Wikia public JSON api for article:
 * http://www.wikia.com/api/v1/#!/Articles
 * This API is really not sufficient for semantic routes, so we'll need some what of retrieving articles by using the
 * article slug name
 */

interface ResponseData {
	wikiName: string;
	articleTitle: string;
	payload?: string;
	articleDetails?: any;
	comments?: any;
	relatedPages?: any;
	userDetails?: any;
}


export function handleRoute(request: Hapi.Request, reply: any): void {
	mediawiki.articleComments(request.params.wiki, parseInt(request.params.articleId, 10))
	.then(function(response){
		reply(response.body);
	})
	.catch(function(error) {
		reply(error);
	});
}
