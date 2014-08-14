/// <reference path="../../../typings/node/node.d.ts" />

import article = require('../article/index');

function index(params, next): void {
	article.createFullArticle(true, {
		wikiName: params.wiki,
		articleTitle: params.title
	}, (data) => {
		var article = data.payload.article,
			title = data.articleTitle,
			namespaces = data.namespaces,
			navData = data.navData,
			language = data.language;
		// We're already sending the article body (which can get quite large) back to get rendered in the template,
		// so let's not send it with the JSON payload either
		delete data.payload.article;
		delete data.payload.title;
		delete data.namespaces;
		delete data.navData;
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
			navData: JSON.stringify(navData),
			language: language
		});
	}, (error) => {
		next(error);
	});
}

export = index;

