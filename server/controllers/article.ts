/// <reference path="../../definitions/node/node.d.ts" />

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
export var get = function (request: any, reply: any) {
	var str: string = '',
		client: http.ClientRequest,
		apiUrl: string = 'http://' + request.params.wiki + '.wikia.com/api/v1/Articles/AsSimpleJson?id=' + request.params.articleId;

	client = http.get(apiUrl, function (api) {
		api.on('data', function (chunk: string) {
			str += chunk;
		});

		api.on('end', function () {
			reply({
				params: request.params,
				payload: JSON.parse(str)
			});

			client.abort();
		});
	});

	client.on('error', function (err: Error) {
		reply(err);
		client.abort();
	});
};
