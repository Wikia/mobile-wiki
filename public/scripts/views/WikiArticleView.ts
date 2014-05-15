/// <reference path="../app.ts" />
'use strict';

Wikia.WikiArticleView = Em.View.extend({
	classNames: ['article-body'],
	didInsertElement: function (): void {
		console.log('Wiki Article View inserted, party time');
		console.log(this);
	},
	click: function (event) {
		if (event.target.tagName === 'A') {
			event.preventDefault();

			this.get('controller.target.router').transitionTo('/w/glee/article/' + event.target.pathname.replace('/wiki/', ''));
		}
	}
});
