/// <reference path="../app.ts" />

App.ArticleContentView = Ember.View.extend({
	tagName: 'article',
	classNames: ['article-content'],
	click: function (event) {
		if (event.target.tagName === 'A') {
			event.preventDefault();
			this.get('controller').send('changePage', event.target.pathname.replace('/wiki/', ''));
		}
	}
});
