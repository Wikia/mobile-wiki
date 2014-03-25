'use strict';
Wikia.Router.map(function () {
	this.resource('wiki', {
		path: '/w/:wikiName'
	}, function () {
		this.route('article', {
			path: 'article/:articleId'
		});
	});
});

Wikia.Router.reopen({
	location: 'history'
});
