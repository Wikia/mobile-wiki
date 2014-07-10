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
			var model = this.get('controller.model');
			var info = W.getLinkInfo(model.get('basepath'),
				model.get('title'),
				event.target.hash,
				event.target.href);

			event.preventDefault();

			if (info.article) {
				this.get('controller').send('changePage', info.article);
			} else if (info.url) {
				// If it's a jump link, then jump.
				if (info.url.charAt(0) === '#' || info.url.match(/https?:\/\/.*\.wikia\.com\/.*/)) {
					window.location = info.url;
				} else {
					window.open(info.url);
				}
			} else {
				console.log('unable to open link "' + event.target.href + '"');
			}
		}
	}
});
