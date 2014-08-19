/// <reference path="../../../typings/node/node.d.ts" />

import article = require('../article/index');
import localSettings = require('../../../config/localSettings');
import MediaWiki = require('../../lib/MediaWiki');

function index(params, next): void {
	article.createFullArticle(true, {
		wikiName: params.wiki,
		articleTitle: params.title
	}, (data) => {
		var article = data.payload.article,
			title = data.articleTitle,
			namespaces = data.namespaces,
			language = data.language;
		// We're already sending the article body (which can get quite large) back to get rendered in the template,
		// so let's not send it with the JSON payload either
		delete data.payload.article;
		delete data.payload.title;
		delete data.namespaces;
		delete data.language;
		next(null, {
			// article content to be rendered on server
			article: {
				content: article,
				title: title,
				cleanTitle: data.articleDetails.title,
				description: data.articleDetails.abstract
			 },
			// article data to bootstrap Ember with in first load of application
			articleJson: JSON.stringify(data),
			wiki: data.wikiName,
			namespaces: JSON.stringify(namespaces),
			language: language,
			mediawikiDomain: MediaWiki.getDomainName(),
			cb: localSettings.mediawikiCb
		});
	}, (error) => {
		next(error);
	});
}

export = index;

