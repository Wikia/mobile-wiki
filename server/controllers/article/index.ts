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
		article = new MediaWiki.ArticleRequest(params.wiki);

	logger.info('Fetching article', params);

	if (getWikiInfo) {
		wikiRequest = new MediaWiki.WikiRequest({
			name: params.wiki
		});

		getVariablesRequest = wikiRequest.getWikiVariables();
	}

	article.fetch(request.articleTitle, request.redirect)
		.then((response: any) => {
			var data = response.data;

			if (!data) {
				err(response);
				return;
			}

			if (!getWikiInfo) {
				callback(data);
			} else {
				logger.info('Fetching wiki variables', params.wiki);

				wikiRequest = new MediaWiki.WikiRequest({
					name: data.wikiName
				});

				getVariablesRequest
					.then((response: any) => {
						data.wiki = response.data;
						callback(data);
					})
					.catch(err);
			}
		})
		.catch(err);
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
