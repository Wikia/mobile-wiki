/// <reference path="../../definitions/hapi/hapi.d.ts" />
/**
 * @description Article controller
 */

import http = require('http');
import mediawiki = require('../lib/medawiki');
import Q = require('q');

/**
 * @description Handler for /article/{wiki}/{articleId} -- Currently calls to Wikia public JSON api for article:
 * http://www.wikia.com/api/v1/#!/Articles
 * This API is really not sufficient for semantic routes, so we'll need some what of retrieving articles by using the
 * article slug name
 */

function getArticle(data) {
	var deferred: Q.Deferred<any> = Q.defer();
	mediawiki.article(data.wikiName, data.articleTitle)
		.then(function(article) {
			data.payload = article.body;
			deferred.resolve(data);
		})
		.catch(function(error) {
			deferred.reject(error);
		});
	return deferred.promise;
}

function getArticleId(data) {
	var deferred: Q.Deferred<any> = Q.defer();
	mediawiki.articleId(data.wikiName, data.articleTitle)
		.then(function(articleIdData) {
			data.articleId = parseInt(Object.keys(articleIdData.query.pages)[0], 10);
			deferred.resolve(data);
		})
		.catch(function(error) {
			deferred.reject(error);
		});
	return deferred.promise;
}

function getArticleComments(data) {
	var deferred: Q.Deferred<any> = Q.defer();
	mediawiki.articleComments(data.wikiName, data.articleId)
		.then(function(articleComments) {
			data.comments = articleComments;
			deferred.resolve(data);
		})
		.catch(function(error) {
			deferred.reject(error);
		});
	return deferred.promise;
}

function getRelatedPages(data) {
	var deferred: Q.Deferred<any> = Q.defer();
	mediawiki.relatedPages(data.wikiName, [data.articleId])
		.then(function(relatedPages) {
			data.relatedPages = relatedPages;
			deferred.resolve(data);
		})
		.catch(function(error) {
			deferred.reject(error);
		});
	return deferred.promise;
}

export function handleRoute(request: Hapi.Request, reply: any) {
	getArticle({
		wikiName: request.params.wiki,
		articleTitle: request.params.articleTitle
	})
	.then(getArticleId)
	.then(getArticleComments)
	.then(getRelatedPages)
	.then(function(response) {
		reply(response);
	})
	.catch(function(error) {
		reply(error);
	});
}
