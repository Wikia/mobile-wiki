/**
 * @description Article controller
 */
var http = require('http');

/**
 * @description Handler for /article/{wiki}/{articleId} -- Currently calls to Wikia public JSON api for article:
 * http://www.wikia.com/api/v1/#!/Articles
 * This API is really not sufficient for semantic routes, so we'll need some what of retrieving articles by using the
 * article slug name
 */
exports.get = function (request, reply) {
	var str,
			client,
			apiUrl;

	apiUrl = 'http://' + request.params.wiki + '.wikia.com/api/v1/Articles/AsSimpleJson?id=' + request.params.articleId;

	str = '';

	client = http.get(apiUrl, function (api) {
		api.on('data', function (chunk) {
			str += chunk;
		});

		api.on('end', function () {
			reply({
				params: request.params,
				payload: JSON.parse(str)
			});
			client.abort();
		});
	}).on('error', function (err) {
		reply(err);
		client.abort();
	});
};
