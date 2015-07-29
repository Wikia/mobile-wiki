/// <reference path="../../../../typings/ember/ember.d.ts" />
/// <reference path="../app.ts" />
/// <reference path="../mixins/AdsMixin.ts" />
/// <reference path="../mixins/LanguagesMixin.ts" />
/// <reference path="../mixins/TrackClickMixin.ts" />
/// <reference path="../mixins/ViewportMixin.ts" />

'use strict';

interface HeadersFromDom {
	level: string;
	name: string;
	id?: string;
}

interface HTMLElement {
	scrollIntoViewIfNeeded: () => void
}

App.ArticleWrapperComponent = Em.Component.extend(App.AdsMixin, App.LanguagesMixin, App.TrackClickMixin, App.ViewportMixin, {
	classNames: ['article-wrapper'],

	hammerOptions: {
		touchAction: 'auto',
		cssProps: {
			/**
			 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/-webkit-touch-callout
			 * 'default' displays the callout
			 * 'none' disables the callout
			 * hammer.js sets it to 'none' by default so we have to override
			 */
			touchCallout: 'default'
		}
	},

	gestures: {
		swipeLeft: function (event: JQueryEventObject): void {
			// Track swipe events
			if ($(event.target).parents('.article-table').length) {

				M.track({
					action: M.trackActions.swipe,
					category: 'tables'
				});
			} else if ($(event.target).parents('.article-gallery').length) {
				M.track({
					action: M.trackActions.paginate,
					category: 'gallery',
					label: 'next'
				});
			}
		},

		swipeRight: function (event: JQueryEventObject): void {
			// Track swipe events
			if ($(event.target).parents('.article-gallery').length) {
				M.track({
					action: M.trackActions.paginate,
					category: 'gallery',
					label: 'previous'
				});
			}
		}
	},

	didInsertElement: function (): void {
		$(window).off('scroll.mercury.preload');
		window.scrollTo(0, M.prop('scroll'));
		this.sendAction('articleRendered');
	},

	contributionFeatureEnabled: Em.computed('model.isMainPage', function (): boolean {
		return !this.get('model.isMainPage') && this.get('isJapaneseWikia');
	}),

	articleObserver: Em.observer('model.article', function (): void {
		// This check is here because this observer will actually be called for views wherein the state is actually
		// not valid, IE, the view is in the process of preRender
		Em.run.scheduleOnce('afterRender', this, this.performArticleTransforms);
	}).on('willInsertElement'),

	modelObserver: Em.observer('model', function (): void {
		var model = this.get('model');

		if (model) {
			document.title = model.get('cleanTitle') + ' - ' + Mercury.wiki.siteName;
			$('meta[name="description"]').attr('content', (typeof model.get('description') === 'undefined') ? '' : model.get('description'));
		}
	}),

	/**
	 * @desc Handle clicks on media and bubble up to Application if anything else was clicked
	 *
	 * @param event
	 * @returns {boolean}
	 */
	click: function (event: MouseEvent): boolean {
		var $anchor = Em.$(event.target).closest('a'),
			target: EventTarget;

		// Here, we want to handle media only, no links
		if ($anchor.length === 0) {
			target = event.target;

			if (this.shouldHandleMedia(target, target.tagName.toLowerCase())) {
				this.handleMedia(<HTMLElement>target);
				event.preventDefault();

				// Don't bubble up
				return false;
			}
		}

		// Bubble up to ApplicationView#click
		return true;
	},

	actions: {
		expandSideNav: function (): void {
			this.sendAction('toggleSideNav', true);
		}
	},

	performArticleTransforms: function (): boolean {
		var model = this.get('model'),
			article = model.get('article');

		if (article && article.length > 0) {
			if (this.get('contributionFeatureEnabled')) {
				this.setupContributionButtons();
			}

			this.loadTableOfContentsData();
			this.injectAds();
			this.setupAdsContext(model.get('adsContext'));

			M.setTrackContext({
				a: model.title,
				n: model.ns
			});

			M.trackPageView(model.get('adsContext.targeting'));
		}

		return true;
	},

	setupContributionButtons: function (): void {
		// TODO: There should be a helper for generating this HTML
		var pencil = '<div class="edit-section"><svg class="icon pencil" role="img"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#pencil"></use></svg></div>',
		    photo = '<div class="upload-photo"><svg class="icon camera" role="img"><use xlink:href="#camera"></use></svg><input class="file-input" type="file" accept="image/*"/></div>',
		    iconsWrapper = '<div class="icon-wrapper">' + pencil + photo + '</div>',
		    $photoZero = this.$('.upload-photo');

		$photoZero
			.on('change', () => {
				this.onPhotoIconChange($photoZero, 0);
			})
			.on('click', () => {
				M.track({
					action: M.trackActions.click,
					category: 'sectioneditor',
					label: 'addPhoto',
					value: 0
				});
			});

		this.$(':header[section]').each((i: Number, item: any): void => {
			var $sectionHeader = this.$(item);
			$sectionHeader.prepend(iconsWrapper).addClass('short-header');
		});
		this.setupButtonsListeners();
	},

	setupButtonsListeners: function () : void {
		this.$('.article-content')
			.on('click', '.pencil', (event: JQueryEventObject): void => {
				var $sectionHeader = $(event.target).closest(':header[section]');
				this.sendAction('edit', this.get('model.cleanTitle'), $sectionHeader.attr('section'));
			})
			.on('click', '.upload-photo', (event: JQueryEventObject): void => {
				var $sectionHeader = $(event.target).closest(':header[section]'),
				    sectionIndex: number = parseInt($sectionHeader.attr('section'), 10);

				M.track({
					action: M.trackActions.click,
					category: 'sectioneditor',
					label: 'addPhoto',
					value: sectionIndex
				});
			})
			.on('change', '.upload-photo', (event: JQueryEventObject): void => {
				var $uploadPhotoContainer = $(event.target).parent(),
				    sectionIndex: number = parseInt($(event.target).closest(':header[section]').attr('section'), 10);
				this.onPhotoIconChange($uploadPhotoContainer, sectionIndex);
			});
	},

	onPhotoIconChange: function(uploadPhotoContainer: JQuery, sectionNumber: number): void {
		var photoData = (<HTMLInputElement>uploadPhotoContainer.find('.file-input')[0]).files[0];
		this.sendAction('addPhoto', this.get('model.cleanTitle'), sectionNumber, photoData);
	},

	/**
	 * @desc Generates table of contents data based on h2 elements in the article
	 * TODO: Temporary solution for generating Table of Contents
	 * Ideally, we wouldn't be doing this as a post-processing step, but rather we would just get a JSON with
	 * ToC data from server and render view based on that.
	 */
	loadTableOfContentsData: function (): void {
		var headers: HeadersFromDom[] = this.$('h2[section]').map((i: number, elem: HTMLElement): HeadersFromDom => {
			if (elem.textContent) {
				return {
					level: elem.tagName,
					name: elem.textContent,
					id: elem.id
				};
			}
		}).toArray();
		this.sendAction('updateHeaders', headers);
	},

	/**
	 * @desc Returns true if handleMedia() should be executed
	 * @param {EventTarget} target
	 * @param {string} tagName clicked tag name
	 * @returns {boolean}
	 */
	shouldHandleMedia: function (target: EventTarget, tagName: string): boolean {
		return (tagName === 'img' || tagName === 'figure') && $(target).children('a').length === 0;
	},

	/**
	 * Opens media lightbox for given target
	 *
	 * @param target
	 */
	handleMedia: function (target: HTMLElement): void {
		var $target = $(target),
			galleryRef = $target.closest('[data-gallery-ref]').data('gallery-ref'),
			$mediaElement = $target.closest('[data-ref]'),
			mediaRef = $mediaElement.data('ref'),
			media: typeof App.MediaModel;

		if (mediaRef >= 0) {
			Em.Logger.debug('Handling media:', mediaRef, 'gallery:', galleryRef);

			if (!$mediaElement.hasClass('is-small')) {
				media = this.get('model.media');
				this.sendAction('openLightbox', 'media', {
					media: media,
					mediaRef: mediaRef,
					galleryRef: galleryRef
				});
			} else {
				Em.Logger.debug('Image too small to open in lightbox', target);
			}

			if (galleryRef >= 0) {
				M.track({
					action: M.trackActions.click,
					category: 'gallery'
				});
			}
		} else {
			Em.Logger.debug('Missing ref on', target);
		}
	}
});
