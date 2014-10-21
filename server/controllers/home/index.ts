/// <reference path="../../../typings/node/node.d.ts" />
/// <reference path="../../../typings/mercury/mercury-server.d.ts" />

import util = require('util');
import article = require('../article/index');
import localSettings = require('../../../config/localSettings');
import Utils = require('../../lib/Utils');

interface ServerData {
	mediawikiDomain: string;
	apiBase: string;
}

/**
 * Create wiki data object
 * @param wiki
 * @returns {any}
 */
function createWikiData (wiki: any) {
	return util._extend(
			{
				// article data to bootstrap Ember with in first load of application
				json: JSON.stringify(wiki || {})
			},
			wiki
		);
}

/**
 * Form the article data
 *
 * @param payload
 * @returns {any}
 */
function createArticleData (payload: any) {
	var data: any;

	if (payload) {
		data = {
			content: payload.article.content
		};
		// We're already sending the article body (which can get quite large) back to get rendered in the template,
		// so let's not send it with the JSON payload either
		delete payload.article.content;
	}

	return util._extend(
		{
			json: JSON.stringify(payload || {}),
			article: payload
		},
		data
	);
}

/**
 * Create server data
 *
 * @returns ServerData
 */
function createServerData (): ServerData {
	return {
		mediawikiDomain: Utils.getWikiDomainName(localSettings),
		apiBase: localSettings.apiBase
	};
}

/**
 * Handle Full page data generation
 * @param params
 * @param next
 */
function index(params: ArticleRequestParams, next: Function): void {
	article.createFullArticle(params, (error: any, article: any, wiki: any) => {
		next(error, {
			server: createServerData(),
			wiki: createWikiData(wiki),
			article: createArticleData(article)
		});
	}, true);
}

export = index;

