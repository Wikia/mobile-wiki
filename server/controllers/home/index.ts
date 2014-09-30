/// <reference path="../../../typings/node/node.d.ts" />

import article = require('../article/index');
import localSettings = require('../../../config/localSettings');
import MediaWiki = require('../../lib/MediaWiki');

function index(params: any, next: Function): void {
	article.createFullArticle(true, params, (errors: any, data: any) => {
		var articleData = data.article,
			wikiData = data.wiki,
			data = {
				article: {
					title: params.title
				}
			};

		if (articleData) {
			var articleContent = articleData.content;

			data.article = {
				// article content to be rendered on server
				content: articleContent,
				cleanTitle: articleData.details.title,
				description: articleData.details.abstract,
				title: params.title
			};

			data.articleJson = JSON.stringify(articleData);

			delete articleData.article.content;
		}

		if (wikiData) {
			data.siteName =  wikiData.siteName;
			// article data to bootstrap Ember with in first load of application
			data.wikiJson = JSON.stringify(wikiData);
			data.cacheBuster = wikiData.cacheBuster;

			// We're already sending the article body (which can get quite large) back to get rendered in the template,
			// so let's not send it with the JSON payload either
			delete data.wiki;
		}

		data.mediawikiDomain = MediaWiki.getDomainName();
		data.apiBase = localSettings.apiBase;

		if (errors.article) {

			data.article = {
				// article content to be rendered on server
				content: errors.article.details,
				cleanTitle: params.title,
				description: errors.article.message,
				title: params.title,
				details: {
					title: params.title,
					revision: {}
				},
				article: {}
			};

			data.error = errors.article;

			data.articleJson = JSON.stringify(data.article);
		}

		next(null, data);
	}, (error: any) => {
		next(error, {
			mediawikiDomain: MediaWiki.getDomainName(),
			apiBase: localSettings.apiBase
		});
	});
}

export = index;

