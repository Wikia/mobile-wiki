/// <reference path="app.ts" />
'use strict';

Ember.Router.map(function () {
	this.resource('wiki', {
		path: '/w/:wikiName'
	}, function () {
		this.route('article', {
			path: 'article/:articleTitle'
		});
	});
});

Ember.Router.reopen({
	location: 'history'
});
