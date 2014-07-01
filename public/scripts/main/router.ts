/// <reference path="./app.ts" />
'use strict';

App.Router.map(function() {
	this.resource('article', {
		path: 'a/:articleTitle'
	});
});

App.Router.reopen({
	location: 'history'
});


