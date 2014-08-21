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
 */
export function createFullArticle(getWikiInfo: boolean, data: any, callback: any, err: any) {
	var wikiVariables,
		article = new MediaWiki.ArticleRequest({
		name: data.wikiName,
		title: data.articleTitle
	});

	if (getWikiInfo) {
		console.log('Fetching wiki variables', data.wikiName);
		wikiVariables = new MediaWiki.WikiRequest({
			name: data.wikiName
		}).getWikiVariables();
	}

	logger.info('Fetching article', data.wikiName, data.articleTitle);

	article.fetch()
		.then((response: any) => {
			var data = response.data;

			if (!data) {
				err(data);
				return;
			}

			if (!wikiVariables) {
				callback(data);
				return;
			}

			wikiVariables.then((payload: any) => {
				data.wiki = payload.data;

				callback(data);
			}).catch((error: any) => {
				err(error);
			});
		});
}

export function handleRoute(request: Hapi.Request, reply: Function): void {
	var data = {
		wikiName: request.params.wikiName,
		articleTitle: decodeURIComponent(request.params.articleTitle)
	};

	createFullArticle(false, data, (data) => {
		reply(data);
	}, (error) => {
		reply(error);
	});
}
