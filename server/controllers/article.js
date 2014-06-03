/// <reference path="../../typings/hapi/hapi.d.ts" />
/// <reference path="../../typings/q/Q.d.ts" />
/**
* @description Article controller
*/
var mediawiki = require('../lib/mediawiki');
var common = require('../lib/common');
var Q = require('q');

var mem = {};


/**
* Gets article data
*
* @param {object} data
* @returns {Q.Promise<*>}
*/
function getArticle(data) {
    return common.promisify(function (deferred) {
        mediawiki.article(data.wikiName, data.articleTitle).then(function (article) {
            data.payload = article.body;
            deferred.resolve(data);
        }).catch(function (error) {
            deferred.reject(error);
        });
    });
}

function getArticleId(data) {
    return common.promisify(function (deferred) {
        mediawiki.articleDetails(data.wikiName, [data.articleTitle]).then(function (articleDetails) {
            if (Object.keys(articleDetails.items).length > 0) {
                data.articleDetails = articleDetails.items[Object.keys(articleDetails.items)[0]];
                deferred.resolve(data);
            } else {
                deferred.reject(new Error('Article not found'));
            }
        }).catch(function (error) {
            deferred.reject(error);
        });
    });
}

function getArticleComments(data) {
    return common.promisify(function (deferred) {
        mediawiki.articleComments(data.wikiName, data.articleDetails.id).then(function (articleComments) {
            data.comments = articleComments;
            deferred.resolve(data);
        }).catch(function (error) {
            deferred.reject(error);
        });
    });
}

function getRelatedPages(data) {
    return common.promisify(function (deferred) {
        mediawiki.relatedPages(data.wikiName, [data.articleDetails.id]).then(function (relatedPages) {
            data.relatedPages = relatedPages;
            deferred.resolve(data);
        }).catch(function (error) {
            deferred.reject(error);
        });
    });
}

function getUserDetails(data) {
    return common.promisify(function (deferred) {
        // todo: get top contributors list
        var userIds = data.contributors.items;
        mediawiki.userDetails(data.wikiName, userIds).then(function (userDetails) {
            data.userDetails = userDetails;
            deferred.resolve(data);
        }).catch(function (error) {
            deferred.reject(error);
        });
    });
}

function getTopContributors(data) {
    return common.promisify(function (deferred) {
        mediawiki.getTopContributors(data.wikiName, data.articleDetails.id).then(function (topContributors) {
            data.contributors = topContributors;
            deferred.resolve(data);
        }).catch(function (error) {
            deferred.reject(error);
        });
    });
}

function handleRoute(request, reply) {
    var data = {
        wikiName: request.params.wiki,
        articleTitle: request.params.articleTitle
    };

    if (mem[data.wikiName + data.articleTitle]) {
        reply(mem[data.wikiName + data.articleTitle]);
    } else {
        getArticleId(data).then(function (data) {
            return Q.all([
                getArticle(data),
                getRelatedPages(data),
                getTopContributors(data).then(function (data) {
                    return getUserDetails(data);
                })
            ]).done(function () {
                reply(data);

                mem[data.wikiName + data.articleTitle] = data;
            });
        }).catch(function (error) {
            reply(error);
        });
    }
}
exports.handleRoute = handleRoute;
