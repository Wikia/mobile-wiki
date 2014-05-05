'use strict';
Ember.Router.map(function () {
	this.resource('wiki', {
		path: '/w/:wikiName'
	}, function () {
		this.route('article', {
			path: 'article/:articleId'
		});
	});
});

Ember.Router.reopen({
	location: 'history'
});
