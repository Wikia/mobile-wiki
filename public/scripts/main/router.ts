/// <reference path="./app.ts" />
'use strict';

App.Router.map(function () {
	this.route('article', {
		path: '/wiki/*title'
	});
	// Route to catch all badly formed URLs, i.e., anything that doesn't match
	// '/', '/wiki' or '/wiki/title', which are the three cases already handled by existing routes.
	this.route('notFound', {path: '/*url'});
});

App.Router.reopen({
	location: 'history'
});
