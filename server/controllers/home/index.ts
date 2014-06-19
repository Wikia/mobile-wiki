/// <reference path="../../../typings/node/node.d.ts" />

import article = require('../article');

function index(pathSegments, next): void {
	article.createFullArticle({
		wikiName: pathSegments[2],
		articleTitle: decodeURIComponent(pathSegments[4])
	}, (data) => {
		var article = data.payload.article;
		var title = data.articleTitle;
		// We're already sending the article body (which can get quite large) back to get rendered in the template,
		// so let's not send it with the JSON payload either
		delete data.payload.article;
		delete data.payload.title;
		next(null, {
			// article content to be rendered on server
			article: {
				content: article,
				title: title,
				description: data.articleDetails.abstract
			 },
			// article data to bootstrap Ember with in first load of application
			articleJson: JSON.stringify(data),
			wiki: data.wikiName
		});
	}, (error) => {
		next(error);
	});
}

export = index;
