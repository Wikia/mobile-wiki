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
 * @param request
 * @param callback
 * @param err
 */
export function createFullArticle(getWikiInfo: boolean, params: any, callback: any, err: any) {
	var wikiRequest: MediaWiki.WikiRequest,
		getVariablesRequest: Promise<any>,
		article = new MediaWiki.ArticleRequest(params.wiki),
		requests = [
			article.fetch(params.title, params.redirect)
		];

	logger.info('Fetching article', params);

	if (getWikiInfo) {
		logger.info('Fetching wiki variables', params.wiki);

		requests.push(new MediaWiki.WikiRequest({
			name: params.wiki
		}).getWikiVariables());
	}

	Promise.all(requests)
		.then((payload: any) => {
			var data = {
					article: payload[0].data,
					wiki: payload[1].data
				},
				errors = {
					article: payload[0].exception,
					wiki: payload[1].exception
				};

			//if (!articleData) {
			//	err(payload);
			//	return;
			//}

			callback(data, errors);
		})
		.catch(function (data, a) {
			console.log(data, a)
		});
}

export function handleRoute(request: Hapi.Request, reply: Function): void {
	var data = {
		wikiName: request.params.wikiName,
		articleTitle: decodeURIComponent(request.params.articleTitle),
		redirect: request.params.redirect
	};

	createFullArticle(false, data, (data: any) => {
		reply(data);
	}, (error: any) => {
		reply(error);
	});
}
