/// <reference path="../app.ts" />

App.ArticleContentView = Ember.View.extend({
	tagName: 'article',
	classNames: ['article-content'],
	click(event) {
		if (event.target.tagName === 'A') {
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
