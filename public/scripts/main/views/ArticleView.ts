/// <reference path="../app.ts" />
'use strict';

interface HeadersFromDom {
	level: string;
	name: string;
	id?: string;
}

var sloth = new Wikia.Modules.Sloth();

App.ArticleView = Em.View.extend({
	classNames: ['article-wrapper'],
	templateName: 'article/index',
	/**
	* willInsertElement
	* @description The article view is only inserted once, and then refreshed on new models. Use this hook to bind
	* events for DOM manipulation
	*/
	willInsertElement: function (): void {
		Ember.addObserver(this.get('controller'), 'article', this, this.onArticleChange);
		// Trigger an article change once on insertion because the first insertion happens after article
		// state has changed
		this.get('controller').notifyPropertyChange('article');
	},

	onArticleChange: function (): void {
		Em.run.scheduleOnce('afterRender', this, () => {
			var model = this.get('controller.model');

			if (this.get('controller.article') && this.get('controller.article').length > 0) {
				var lazyImages = this.$('.article-media');
				var lazy = new Wikia.Modules.LazyLoad();

				lazy.fixSizes(lazyImages);

				sloth.drop();
				sloth.attach({
					on: lazyImages,
					threshold: 400,
					callback: (elem) => lazy.load(elem, false, model.get('media'))
				});
				this.loadTableOfContentsData();
				this.replaceHeadersWithArticleSectionHeaders();
				this.injectAds();
			}
		});
	},

	injectAds: function () {
		var viewClass = Ember.View.extend({
			templateName: 'components/ad-slot'
		}),
			inContent = this.createChildView(viewClass, { context: {
				name: 'MOBILE_IN_CONTENT'
			}}),
			prefooter = this.createChildView(viewClass, { context: {
				name: 'MOBILE_PREFOOTER'
			}});

		//TODO: Lazyload?
		//TODO: should not be appended always
		//TODO: abstract it somewhere?
		this.$('h2:first').before(inContent.renderToBuffer().buffer);
		this.$('.article-body').after(prefooter.renderToBuffer().buffer);
	},

	modelObserver: function () {
		var model = this.get('controller.model');
		if (model) {
			var wiki = model.get('wiki');
			var title = model.get('cleanTitle');
			document.title = title + ' - ' + wiki + ' wiki';
		}
	}.property('controller.model'),

	/**
	 * @desc Generates table of contents data based on h2 elements in the article
	 * TODO: Temporary solution for generating Table of Contents
	 * Ideally, we wouldn't be doing this as a post-processing step, but rather we would just get a JSON with
	 * ToC data from server and render view based on that.
	 */
	loadTableOfContentsData: function () {
		var headers: HeadersFromDom[] = this.$('h2').map((i, elem: HTMLElement): HeadersFromDom => {
			return {
				level: elem.tagName,
				name: elem.textContent,
				id: elem.id
			};
		}).toArray();
		this.get('controller').send('updateHeaders', headers);
	},

	/**
	 * @desc Calls replaceWithArticleSectionHeader for every h3 (h2's already done in
	 * loadTableOfContentsData)
	 */
	replaceHeadersWithArticleSectionHeaders: function () {
		this.$('h2,h3').map((i, elem: HTMLElement) => {
			this.replaceWithArticleSectionHeader(elem);
		});
	},

	replaceWithArticleSectionHeader: function (elem: HTMLElement) {
		var header = this.createChildView('ArticleSectionHeader', {
			context: {
				tag: elem.tagName,
				title: elem.id,
				cleanTitle: elem.textContent
			}
		});
		header.createElement();

		this.$(elem).replaceWith(header.$());
	}
});
