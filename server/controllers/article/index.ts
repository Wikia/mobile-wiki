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
export function createFullArticle(getWikiInfo: boolean, params: any, callback: any) {
	var requests = [
			new MediaWiki.ArticleRequest(params.wiki).fetch(params.title, params.redirect)
		];

	logger.info('Fetching article', params);

	if (getWikiInfo) {
		logger.info('Fetching wiki variables', params.wiki);

		requests.push(new MediaWiki.WikiRequest({
			name: params.wiki
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

	createFullArticle(false, data, (error: any, article: any) => {
		reply(error || article);
	});
}
