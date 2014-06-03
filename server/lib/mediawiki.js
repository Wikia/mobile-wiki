/// <reference path="../../typings/q/Q.d.ts" />
/// <reference path="../../typings/node/node.d.ts" />
/// <reference path="../../typings/follow-redirects/follow-redirects.d.ts" />
/// <reference path="common.ts" />
/**
* @description Mediawiki API functions
*/
var followRedirects = require('follow-redirects');
var common = require('./common');
var localSettings = require('../../config/localSettings');

var mediawiki;
(function (mediawiki) {
    function getDomainName(wikiSubDomain) {
        var environment = localSettings.environment, options = {
            production: '',
            preview: 'preview.',
            verify: 'verify.'
        };

        if (!environment) {
            throw Error('Environment not set');
        }
        if (typeof options[environment] !== 'undefined') {
            return 'http://' + options[environment] + wikiSubDomain + '.wikia.com/';
        }

        // Devbox
        return 'http://' + wikiSubDomain + '.' + environment + '.wikia-dev.com/';
    }

    function createUrl(wikiSubDomain, path, params) {
        if (typeof params === "undefined") { params = {}; }
        var qsAggregator = [];
        Object.keys(params).forEach(function (key) {
            qsAggregator.push(key + '=' + encodeURIComponent(params[key]));
        });
        return getDomainName(wikiSubDomain) + path + (qsAggregator.length > 0 ? '?' + qsAggregator.join('&') : '');
    }

    function httpGet(url) {
        return common.promisify(function (deferred) {
            var buffer = '';
            followRedirects.http.get(url, function (res) {
                res.on('data', function (chunk) {
                    buffer += chunk;
                });

                res.on('end', function () {
                    deferred.resolve({
                        body: buffer,
                        headers: res.headers
                    });
                });
            }).on('error', function (err) {
                deferred.reject(err);
            });
        });
    }

    function jsonGet(url) {
        return common.promisify(function (deferred) {
            httpGet(url).then(function (data) {
                try  {
                    deferred.resolve(JSON.parse(data.body));
                } catch (error) {
                    deferred.reject(error);
                }
            }).catch(function (error) {
                deferred.reject(error);
            });
        });
    }

    function article(wikiName, articleTitle) {
        return httpGet(createUrl(wikiName, 'index.php', {
            useskin: 'wikiamobile',
            action: 'render',
            title: articleTitle
        }));
    }
    mediawiki.article = article;

    function articleDetails(wikiName, articleTitles) {
        return jsonGet(createUrl(wikiName, 'api/v1/Articles/Details', {
            titles: articleTitles.map(function (text) {
                return text.replace(' ', '_');
            }).join(',')
        }));
    }
    mediawiki.articleDetails = articleDetails;

    function articleComments(wikiName, articleId) {
        // @todo JSON comments
        return httpGet(createUrl(wikiName, 'wikia.php', {
            controller: 'ArticleComments',
            method: 'Content',
            articleId: articleId.toString()
        }));
    }
    mediawiki.articleComments = articleComments;

    function relatedPages(wikiName, articleIds, limit) {
        if (typeof limit === "undefined") { limit = 6; }
        return jsonGet(createUrl(wikiName, 'api/v1/RelatedPages/List', {
            ids: articleIds.join(','),
            limit: limit.toString()
        }));
    }
    mediawiki.relatedPages = relatedPages;

    function userDetails(wikiName, userIds) {
        return jsonGet(createUrl(wikiName, 'api/v1/User/Details', {
            ids: userIds.join(',')
        }));
    }
    mediawiki.userDetails = userDetails;

    function getArticleCommentsCount(wikiName, articleId) {
        return jsonGet(createUrl(wikiName, 'api/v1/Mercury/ArticleCommentsCount', {
            articleId: articleId.toString()
        }));
    }
    mediawiki.getArticleCommentsCount = getArticleCommentsCount;

    function getWikiTheme(wikiName) {
        return jsonGet(createUrl(wikiName, 'api/v1/Mercury/WikiSettings'));
    }
    mediawiki.getWikiTheme = getWikiTheme;

    function getTopContributors(wikiName, articleId) {
        return jsonGet(createUrl(wikiName, 'api/v1/Mercury/TopContributorsPerArticle', {
            articleId: articleId.toString()
        }));
    }
    mediawiki.getTopContributors = getTopContributors;
})(mediawiki || (mediawiki = {}));

module.exports = mediawiki;
