/// <reference path="../app.ts" />

App.ArticleContentView = Ember.View.extend({
	tagName: 'article',
	classNames: ['article-content'],
	click: function (event) {
		var target;
		/**
		* Could cache the $ selector lookup before the if, but that would mean it'd be run for each click regardless
		* So we just eat the overhead for instances of elements wrapped in anchors eg:
		* <a href="foo">This <em>link</em></a>
		* This is because it's overall more performant to skip the lookup completely first test in the
		* condition passes
		*/
		if (event.target.tagName === 'A' || Ember.$(event.target).closest('a').length) {
			event.preventDefault();
			target = event.target.pathname || Ember.$(event.target).closest('a')[0].pathname;
			this.get('controller').send('changePage', target.replace('/wiki/', ''));
		}
	}
});
