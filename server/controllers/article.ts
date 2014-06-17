/// <reference path="../../typings/hapi/hapi.d.ts" />
/// <reference path="../../typings/q/Q.d.ts" />
/**
 * @description Article controller
 */

import mediawiki = require('../lib/mediawiki');
import common = require('../lib/common');
import Q = require('q');

var mem = {};
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
	contributors?: any;
}

/**
 * Gets article data
 *
 * @param {object} data
 * @returns {Q.Promise<*>}
 */
function getArticle(data: ResponseData): Q.Promise<any> {
	return common.promisify((deferred: Q.Deferred<any>) => {
		mediawiki.article(data.wikiName, data.articleTitle)
			.then((article) => {
				data.payload = article.body;
				deferred.resolve(data);
			})
			.catch((error) => {
				deferred.reject(error);
			});
	});
}

function getArticleId(data: ResponseData): Q.Promise<any> {
	return common.promisify((deferred: Q.Deferred<any>) => {
		mediawiki.articleDetails(data.wikiName, [data.articleTitle])
			.then((articleDetails) => {
				if (Object.keys(articleDetails.items).length > 0) {
					data.articleDetails = articleDetails.items[Object.keys(articleDetails.items)[0]];
					deferred.resolve(data);
				} else {
					deferred.reject(new Error('Article not found'));
				}
			})
			.catch((error) => {
				deferred.reject(error);
			});
	});
}

function getArticleComments(data: ResponseData): Q.Promise<any> {
	return common.promisify((deferred: Q.Deferred<any>) => {
		mediawiki.articleComments(data.wikiName, data.articleDetails.id)
			.then((articleComments) => {
				data.comments = articleComments;
				deferred.resolve(data);
			})
			.catch((error) => {
				deferred.reject(error);
			});
	});
}

function getRelatedPages(data: ResponseData): Q.Promise<any> {
	return common.promisify((deferred: Q.Deferred<any>) => {
		mediawiki.relatedPages(data.wikiName, [data.articleDetails.id])
			.then((relatedPages) => {
				data.relatedPages = relatedPages;
				deferred.resolve(data);
			})
			.catch((error) => {
				deferred.reject(error);
			});
	});
}

function getUserDetails(data: ResponseData): Q.Promise<any> {
	return common.promisify(function(deferred: Q.Deferred<any>) {
		// todo: get top contributors list
		var userIds: number[] = data.contributors.items;

		if (userIds) {
			mediawiki.userDetails(data.wikiName, userIds)
				.then(function(userDetails) {
					data.userDetails = userDetails;
					deferred.resolve(data);
				})
				.catch(function(error) {
					deferred.reject(error);
				});
		} else {
			data.userDetails = [];
			deferred.resolve(data);
		}
	});
}

function getTopContributors(data: ResponseData): Q.Promise<any> {
	return common.promisify((deferred: Q.Deferred<any>) => {
		mediawiki.getTopContributors(data.wikiName, data.articleDetails.id)
			.then((topContributors) => {
				data.contributors = topContributors;
				deferred.resolve(data);
			})
			.catch((error) => {
				deferred.reject(error);
			});
	});
}

export function createFullArticle(data: any, callback: any, err: any) {
	getArticleId(data)
		.then((data) => {
			return Q.all([
				getArticle(data),
				getRelatedPages(data),
				getTopContributors(data).then((data) => {
					return getUserDetails(data);
				})
			]).done(() => {
					callback(data);
				});

		}).catch(() => {
			err();
		});
}

export function handleRoute(request: Hapi.Request, reply: Function): void {
	var data = {
		wikiName: request.params.wiki,
		articleTitle: decodeURIComponent(request.params.articleTitle)
	};
	if (mem[data.wikiName + data.articleTitle]) {
		reply(mem[data.wikiName + data.articleTitle]);

	} else {
		createFullArticle(data, (data) => {
			reply(data);
			mem[data.wikiName + data.articleTitle] = data;
		}, (error) => {
			reply(error);
		});
	}
}
