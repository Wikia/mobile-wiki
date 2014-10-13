/// <reference path="../../../typings/hapi/hapi.d.ts" />
/// <reference path="../../../typings/bluebird/bluebird.d.ts" />

/**
 * @description Article controller
 */
import MediaWiki = require('../../lib/MediaWiki');
import Promise = require('bluebird');
import logger = require('../../lib/Logger');


/**
 * @description Handler for /article/{wiki}/{articleId} -- Currently calls to Wikia public JSON api for article:
 * http://www.wikia.com/api/v1/#!/Articles
 * This API is really not sufficient for semantic routes, so we'll need some what of retrieving articles by using the
 * article slug name
 * @param getWikiInfo whether or not to make a WikiRequest to get information about the wiki
 * @param params
 * @param callback
 * @param err
 */
export function createFullArticle(params: any, callback: any, getWikiInfo: boolean = false):void {
	var requests = [
			new MediaWiki.ArticleRequest(params.wikiDomain).fetch(params.title, params.redirect)
		];

	logger.debug(params, 'Fetching article');

	if (getWikiInfo) {
		logger.debug({wiki: params.wikiDomain}, 'Fetching wiki variables');

		requests.push(new MediaWiki.WikiRequest({
			wikiDomain: params.wikiDomain
		}).getWikiVariables());
	}

	Promise.all(requests)
		.spread((article: any, wiki: any = {}) => {
			callback(article.exception, article.data, wiki.data);
		})
		.catch((error: any) => {
			callback(error);
		});
}

export function handleRoute(request: Hapi.Request, reply: Function): void {
	var data = {
		wikiName: request.params.wikiName,
		articleTitle: decodeURIComponent(request.params.articleTitle),
		redirect: request.params.redirect
	};

	createFullArticle(data, (error: any, article: any) => {
		reply(error || article);
	});
}
