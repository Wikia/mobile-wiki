/// <reference path="../../../typings/node/node.d.ts" />

import util = require('util');
import article = require('../article/index');
import localSettings = require('../../../config/localSettings');
import MediaWiki = require('../../lib/MediaWiki');

function createWikiData (wiki: any) {
	return util._extend(
			{
				// article data to bootstrap Ember with in first load of application
				json: JSON.stringify(wiki || {})
			},
			wiki
		)
}

function createArticleData (payload: any) {
	var data;

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
	)
}

function createServerData () {
	return {
		mediawikiDomain: MediaWiki.getDomainName(),
		apiBase: localSettings.apiBase
	};
}

function index(params: any, next: Function): void {
	article.createFullArticle(true, params, (error: any, article: any, wiki: any) => {
		next(error, {
			server: createServerData(),
			wiki: createWikiData(wiki),
			article: createArticleData(article)
		})
	});
}

export = index;

