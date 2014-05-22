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

Ember.Route.reopen({
	render: function(controller, model) {
		this._super();
		window.scrollTo(0, 0);
	}
});
