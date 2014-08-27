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
 * @param data
 * @param callback
 * @param err
 */
export function createFullArticle(getWikiInfo: boolean, data: any, callback: any, err: any) {
	var wikiRequest: any,
		wikiVariables: any,
		article = new MediaWiki.ArticleRequest({
			name: data.wikiName,
			title: data.articleTitle
		});

	if (getWikiInfo) {
		logger.info('Fetching wiki variables', data.wikiName);
		wikiRequest = new MediaWiki.WikiRequest({
			name: data.wikiName
		});

		props = {
			wikiState: wikiRequest.getWikiVariables(),
			navData: wikiRequest.getLocalNavData()
		};

		wikiVariables = Promise.props(props);
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
				payload.wikiState.navData = payload.navData;
				data.wiki = payload.wikiState;
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

	createFullArticle(false, data, (data: any) => {
		reply(data);
	}, (error: any) => {
		reply(error);
	});
}
