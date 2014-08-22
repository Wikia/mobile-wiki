/// <reference path="./app.ts" />
'use strict';

App.Router.map(function () {
	this.resource('article', {
		path: '/a/:articleTitle'
	}, function () {
		this.route('comments', {path: 'comments'});
	});
	// Route to catch all badly formed URLs, i.e., anything that doesn't match
	// '/', '/a' or '/a/title', which are the three cases already handled by existing routes.
	this.route('notFound', {path: '/*url'});
});

App.Router.reopen({
	location: 'history'
});
