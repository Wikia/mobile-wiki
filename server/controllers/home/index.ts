/// <reference path="../../../typings/node/node.d.ts" />

import article = require('../article');

function index(request: any, reply: { view: Function }) {
	var parts = request._pathSegments;

	article.createFullArticle({
		wikiName: parts[2],
		articleTitle: decodeURIComponent(parts[4])
	}, (data) => {
		var payload = data.payload;
		var title = data.cleanTitle;
		// We're already sending the article body (which can get quite large) back to get rendered in the template,
		// so let's not send it with the JSON payload either
		delete data.payload;
		delete data.cleanTitle;
		reply.view('application', {
			// article content to be rendered on server
			article: {
				payload: payload,
				cleanTitle: title
			 },
			// article data to bootstrap Ember with in first load of application
			articleJson: JSON.stringify(data)
		});
	}, (error) => {
		reply.view('application', {
			article: error
		});
	});
}

export = index;
