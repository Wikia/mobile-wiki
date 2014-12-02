/// <reference path="./app.ts" />
'use strict';

App.Router.map(function () {
	this.route('article', {
		//This can be either '/*title' or '/wiki/*title' and is based on configuration
		//That is coming from MW
		path: Mercury.wiki.articlePath + '*title'
	});
	// Route to catch all badly formed URLs, i.e., anything that doesn't match
	// '/', '/wiki' or '/wiki/title', which are the three cases already handled by existing routes.
	this.route('notFound', {path: '/*url'});
});

App.Router.reopen({
	location: 'history'
});
