/// <reference path="../../definitions/hapi/hapi.d.ts" />
/**
 * @description Article controller
 */

import http = require('http');

/**
 * @description Handler for /article/{wiki}/{articleId} -- Currently calls to Wikia public JSON api for article:
 * http://www.wikia.com/api/v1/#!/Articles
 * This API is really not sufficient for semantic routes, so we'll need some what of retrieving articles by using the
 * article slug name
 */
export var get = function (request: Hapi.Request, reply: any) {
	var str: string = '',
		client: http.ClientRequest,
		apiUrl: string = 'http://' + request.params.wiki + '.wikia.com/index.php?useskin=wikiamobile&action=render&title=' + request.params.articleTitle;

	client = http.get(apiUrl, function (api) {
		api.on('data', function (chunk: string) {
			str += chunk;
		});

		api.on('end', function () {
			reply({
				params: request.params,
				payload: str
			});

			client.abort();
		});
	});

	client.on('error', function (err: Error) {
		reply(err);
		client.abort();
	});
};
