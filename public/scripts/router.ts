/// <reference path="./app.ts" />
'use strict';

App.Router.map(function () {
	this.resource('wiki', {
		path: '/w/:wikiName'
	}, function () {
		this.route('article', {
			path: 'article/:articleTitle'
		});
	});
});

App.Router.reopen({
	location: 'history'
});
