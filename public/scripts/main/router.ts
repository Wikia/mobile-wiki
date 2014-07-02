/// <reference path="./app.ts" />
'use strict';

App.Router.map(function () {
	this.resource('articles', {
		path: '/a'
	}, function () {
		this.resource('article', {path: ':articleTitle'}, function () {
			this.route('comments', {path: 'comments'});
		});
	});
});

App.Router.reopen({
	location: 'history'
});


