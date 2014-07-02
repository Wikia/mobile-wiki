/// <reference path="../app.ts" />
/// <reference path="../utils/sloth.ts" />
/// <reference path="../utils/lazyload.ts" />
'use strict';

interface HeadersFromDom {
	level: string;
	name: string;
	id?: string;
}

var sloth = new W.Sloth();

App.ArticleView = Em.View.extend({
	classNames: ['article-wrapper'],
	templateName: 'article/index',
	articleObserver: function() {
		Em.run.later(null, () => {
			var model = this.get('controller.model');

			if (this.get('controller.article') && this.get('controller.article').length > 0) {
				var lazyImages = this.$('.article-media');
				var lazy = new W.LazyLoad();

				lazy.fixSizes(lazyImages);

				sloth.drop();
				sloth.attach({
					on: lazyImages,
					threshold: 400,
					callback: (elem) => lazy.load(elem, false, model.get('media'))
				});

				// TODO: Temporary solution for generating Table of Contents
				// Ideally, we wouldn't be doing this as a post-processing step, but rather we would just get a JSON with
				// ToC data from server and render view based on that.
				var headers: HeadersFromDom[] = this.$('h2').map((i, elem: HTMLElement): HeadersFromDom => {
					return {
						level: elem.tagName,
						name: elem.textContent,
						id: elem.id
					};
				}).toArray();

				this.get('controller').send('updateHeaders', headers);
			}

		}, 1000);
	}.observes('controller.article')
});
