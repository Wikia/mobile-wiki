/// <reference path="../../typings/hapi/hapi.d.ts" />
/**
* @description ArticleComments controller
*/
var mediawiki = require('../lib/mediawiki');

/**
* @description Handler for /articleComments/{wiki}/{articleId}
*/
function handleRoute(request, reply) {
    mediawiki.articleComments(request.params.wiki, parseInt(request.params.articleId, 10)).then(function (response) {
        reply(response.body);
    }).catch(function (error) {
        reply(error);
    });
}
exports.handleRoute = handleRoute;
