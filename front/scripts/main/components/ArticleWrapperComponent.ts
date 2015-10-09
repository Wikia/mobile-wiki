/// <reference path="../../../../typings/ember/ember.d.ts" />
/// <reference path="../app.ts" />
/// <reference path="../mixins/LanguagesMixin.ts" />
/// <reference path="../mixins/TrackClickMixin.ts" />
/// <reference path="../mixins/ViewportMixin.ts" />

'use strict';

interface ArticleSectionHeader {
	element: HTMLElement;
	level: string;
	name: string;
	id?: string;
	section: string;
}

App.ArticleWrapperComponent = Em.Component.extend(App.LanguagesMixin, App.TrackClickMixin, App.ViewportMixin, {
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
		swipeLeft(event: JQueryEventObject): void {
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

		swipeRight(event: JQueryEventObject): void {
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

	didInsertElement(): void {
		$(window).off('scroll.mercury.preload');
		window.scrollTo(0, M.prop('scroll'));

		Em.run.scheduleOnce('afterRender', this, (): void => {
			this.sendAction('articleRendered');
		});
	},

	uploadFeatureEnabled: Em.computed(function(): boolean {
		return !Em.get(Mercury, 'wiki.disableAnonymousUploadForMercury');
	}),

	contributionFeatureEnabled: Em.computed('model.isMainPage', function (): boolean {
		return !this.get('model.isMainPage')
			&& this.get('isJapaneseWikia')
			&& !Em.get(Mercury, 'wiki.disableAnonymousEditing');
	}),

	curatedContentToolButtonVisible: Em.computed.and('model.isMainPage', 'currentUser.rights.curatedcontent'),

	articleObserver: Em.observer('model.article', function (): void {
		// This check is here because this observer will actually be called for views wherein the state is actually
		// not valid, IE, the view is in the process of preRender
		Em.run.scheduleOnce('afterRender', this, this.performArticleTransforms);
	}).on('willInsertElement'),

	modelObserver: Em.observer('model', function (): void {
		var model = this.get('model'),
			description: string;

		if (model) {
			document.title = model.get('cleanTitle') + ' - ' + Mercury.wiki.siteName;
			description = (typeof model.get('description') === 'undefined') ? '' : model.get('description');
			$('meta[name="description"]').attr('content', description);
		}
	}),

	/**
	 * @desc Handle clicks on media and bubble up to Application if anything else was clicked
	 *
	 * @param event
	 * @returns {boolean}
	 */
	click(event: MouseEvent): boolean {
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
		edit(title: string, sectionIndex: number): void {
			this.sendAction('edit', title, sectionIndex);
		},

		addPhoto(title: string, sectionIndex: number, photoData: any): void {
			this.sendAction('addPhoto', title, sectionIndex, photoData);
		},

		expandSideNav(): void {
			this.sendAction('toggleSideNav', true);
		},

		openLightbox(lightboxType: string, lightboxData: any): void {
			this.sendAction('openLightbox', lightboxType, lightboxData);
		},

		updateHeaders(headers: ArticleSectionHeader[]): void {
			this.set('headers', headers);
		}
	},

	performArticleTransforms(): boolean {
		var model = this.get('model'),
			article = model.get('article');

		if (article && article.length > 0) {
			M.setTrackContext({
				a: model.title,
				n: model.ns
			});

			M.updateTrackedUrl(window.location.href);
			M.trackPageView(model.get('adsContext.targeting'));
		}

		return true;
	},

	/**
	 * @desc Returns true if handleMedia() should be executed
	 * @param {EventTarget} target
	 * @param {string} tagName clicked tag name
	 * @returns {boolean}
	 */
	shouldHandleMedia(target: EventTarget, tagName: string): boolean {
		return (tagName === 'img' || tagName === 'figure') && $(target).children('a').length === 0;
	},

	/**
	 * Opens media lightbox for given target
	 *
	 * @param target
	 */
	handleMedia(target: HTMLElement): void {
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
