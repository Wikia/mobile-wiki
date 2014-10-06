/// <reference path="../app.ts" />
/// <reference path="../models/ArticleModel.ts" />
/// <reference path="../components/MediaComponent.ts" />
'use strict';

interface HeadersFromDom {
	level: string;
	name: string;
	id?: string;
}

interface DOMStringMap {
	ref: string;
}

interface HTMLElement {
	scrollIntoViewIfNeeded: () => void
}

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
		Em.addObserver(this.get('controller'), 'article', this, this.onArticleChange);
		// Trigger an article change once on insertion because the first insertion happens after article
		// state has changed
		this.get('controller').notifyPropertyChange('article');
	},

	didInsertElement: function () {
		this.get('controller').send('articleRendered');
	},

	onArticleChange: function (): void {
		Em.run.scheduleOnce('afterRender', this, () => {
			var model = this.get('controller.model');

			if (this.get('controller.article') && this.get('controller.article').length > 0) {
				this.loadTableOfContentsData();
				this.handleInfoboxes();
				this.replaceHeadersWithArticleSectionHeaders();
				this.injectAds();
				this.setupAdsContext(model.get('adsContext'));
				this.jumpToAnchor();
				this.lazyLoadMedia(model.get('media'));
				this.handleTables();
				Wikia.Tracking.trackPageView();
			}
		});
	},

	createMediaComponent: function (element: HTMLElement, model: typeof App.ArticleModel) {
		var ref = parseInt(element.dataset.ref, 10),
			media = model.find(ref);

		var component = this.createChildView(App.MediaComponent.newFromMedia(media), {
			ref: ref,
			width: parseInt(element.getAttribute('width'), 10),
			height: parseInt(element.getAttribute('height'), 10),
			imgWidth: element.offsetWidth,
			media: media
		}).createElement();

		return component.$().attr('data-ref', ref);
	},

	lazyLoadMedia: function (model: typeof App.ArticleModel) {
		var lazyImages = this.$('.article-media');

		lazyImages.each((index: number, element: HTMLImageElement) => {
			this.$(element).replaceWith(this.createMediaComponent(element, model));
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

	/**
	 * @desc handles expanding long tables, code taken from WikiaMobile
	 */
	handleInfoboxes: function () {
		var shortClass = 'short',
			$infoboxes = $('table[class*="infobox"] tbody'),
			body = window.document.body,
			scrollTo = body.scrollIntoViewIfNeeded || body.scrollIntoView;

		if ($infoboxes.length) {
			$infoboxes
				.filter(function () {
					return this.rows.length > 6;
				})
				.addClass(shortClass)
				.append('<tr class=infobox-expand><td colspan=2><svg viewBox="0 0 12 7" class="icon"><use xlink:href="#chevron"></use></svg></td></tr>')
				.on('click', function (event) {
					var $target = $(event.target),
						$this = $(this);

					if (!$target.is('a') && $this.toggleClass(shortClass).hasClass(shortClass)) {
						scrollTo.apply($this.find('.infobox-expand')[0]);
					}
				});
		}
	},

	handleTables: function (): void {
		var wrapper = document.createElement('div');
		wrapper.className = 'article-table';
		this.$('table:not(.infobox, .dirbox)')
			.wrap(wrapper)
			.css('visibility', 'visible');
	}
});
