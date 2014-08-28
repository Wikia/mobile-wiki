/// <reference path="../../../typings/node/node.d.ts" />

import article = require('../article/index');
import localSettings = require('../../../config/localSettings');
import MediaWiki = require('../../lib/MediaWiki');

function index(params: any, next: Function): void {
	article.createFullArticle(true, {
		wikiName: params.wiki,
		articleTitle: params.title
	}, (data: any) => {
		var articleContent = data.article.content,
			wiki = data.wiki;

		// We're already sending the article body (which can get quite large) back to get rendered in the template,
		// so let's not send it with the JSON payload either
		delete data.article.content;
		delete data.wiki;

		next(null, {
			// article content to be rendered on server
			article: {
				content: articleContent,
				title: params.title,
				cleanTitle: data.details.title,
				description: data.details.abstract
			 },
			// article data to bootstrap Ember with in first load of application
			articleJson: JSON.stringify(data),
			siteName: wiki.siteName,
			wikiJson: JSON.stringify(wiki),
			mediawikiDomain: MediaWiki.getDomainName(),
			cacheBuster: wiki.cacheBuster
		});
	}, (error: any) => {
		next(error);
	});
}

export = index;

