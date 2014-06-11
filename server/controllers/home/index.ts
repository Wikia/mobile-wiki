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
		delete data.payload;
		delete data.cleanTitle;
		reply.view('application', {
			article: {
						 payload: payload,
						 cleanTitle: title
					 },
			articleJson: JSON.stringify(data)
		});
	}, (error) => {
		reply.view('application', {
			article: error
		});
	});
}

export = index;
