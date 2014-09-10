/// <reference path="../app.ts" />
/// <reference path="../models/ArticleModel.ts" />
/// <reference path="../../wikia/modules/sloth.ts" />
/// <reference path="../../wikia/modules/lazyLoad.ts" />
'use strict';

interface HeadersFromDom {
	level: string;
	name: string;
	id?: string;
}

var sloth = new Wikia.Modules.Sloth();

App.ArticleView = Em.View.extend(App.AdsMixin, {
	classNames: ['article-wrapper'],
	templateName: 'article/index',
	/**
	* @description Ember does not natively support hashes in the URL, so we must support this functionality
	* manually
	*/
	jumpToAnchor: function (): void {
		var hash = App.get('hash'),
			prevHash: string;

		if (hash) {
			window.location.hash = hash;
		}

		// This is a hack to ensure that #hash jump links are preserved when navigating with browser native
		// "back" button
		if (!hash && window.location.hash) {
			prevHash = window.location.hash;
			window.location.hash = '#top';
			window.location.hash = prevHash;
		}

		App.set('hash', null);
	},

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
				this.lazyLoadMedia(model);
				this.loadTableOfContentsData();
				this.replaceHeadersWithArticleSectionHeaders();
				this.setupAdsContext(model.get('adsContext'));
				this.injectAds();
				this.jumpToAnchor();
				this.scrollToComments();
			}
		});
	},

	lazyLoadMedia: function (model: typeof App.ArticleModel) {
		var lazyImages = this.$('.article-media'),
			lazy = new Wikia.Modules.LazyLoad();

		lazy.fixSizes(lazyImages);

		sloth.drop();
		sloth.attach({
			on: lazyImages,
			threshold: 400,
			callback: (elem: HTMLElement) => lazy.load(elem, false, model.get('media'))
		});
	},

	modelObserver: function (): void {
		var model = this.get('controller.model');

		if (model) {
			var title = model.get('cleanTitle');
			document.title = title + ' - ' + Wikia.wiki.siteName;
		}
	}.observes('controller.model'),

	/**
	 * @desc Generates table of contents data based on h2 elements in the article
	 * TODO: Temporary solution for generating Table of Contents
	 * Ideally, we wouldn't be doing this as a post-processing step, but rather we would just get a JSON with
	 * ToC data from server and render view based on that.
	 */
	loadTableOfContentsData: function () {
		var headers: HeadersFromDom[] = this.$('h2').map((i: number, elem: HTMLElement): HeadersFromDom => {
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
		this.$('h2,h3').map((i: number, elem: HTMLElement) => {
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
	},

	scrollToComments: function () {
		var controller = this.get('controller');

		if (controller.get('commentsPage') >= 0 ) {
			window.scrollTo(0, this.$('.show-comments-btn').offset().top);
		}
	},

	didInsertElement: function () {
		var controller = this.get('controller');

		if (controller.get('file')) {
			controller.send('openLightbox', 'media-lightbox');
		}

		if (!Em.isEmpty(controller.get('commentsPage'))) {
			controller.send('toggleComments', controller.get('commentsPage'));
		}
	}
});
