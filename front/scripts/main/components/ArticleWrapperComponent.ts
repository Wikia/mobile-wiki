/// <reference path="../../../../typings/ember/ember.d.ts" />
/// <reference path="../app.ts" />
/// <reference path="../mixins/LanguagesMixin.ts" />
/// <reference path="../mixins/TrackClickMixin.ts" />
/// <reference path="../mixins/ViewportMixin.ts" />

'use strict';

/**
 * ArticleSectionHeader
 * @typedef ArticleSectionHeader
 * @property {HTMLElement} element
 * @property {string} level
 * @property {string} name
 * @property {string} [id]
 * @property {string} section
 */

interface ArticleSectionHeader {
	element: HTMLElement;
	level: string;
	name: string;
	id?: string;
	section: string;
}

App.ArticleWrapperComponent = Em.Component.extend(
	App.LanguagesMixin,
	App.TrackClickMixin,
	App.ViewportMixin,
	{
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
				touchCallout: 'default',
			}
		},

		gestures: {
			/**
			 * @param {JQueryEventObject} event
			 * @returns {void}
			 */
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

			/**
			 * @param {JQueryEventObject} event
			 * @returns {void}
			 */
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


		/**
		 * Checks if contribution component should be enabled
		 * http://clashofclans.wikia.com/        db: clashofclans
		 * http://de.clashofclans.wikia.com/     db: declashofclans
		 * http://zh.clashofclans.wikia.com/     db: zhclashofclans723
		 * http://fr.clashofclans.wikia.com/     db: frclashofclans
		 * http://ru.clashofclans.wikia.com/     db: ruclashofclans
		 * http://es.clash-of-clans.wikia.com/   db: esclashofclans727
		 * http://pt-br.clashofclans.wikia.com/  db: ptbrclashofclans
		 *
		 * @returns {boolean} True if contribution component is enabled for this community
		 */
		contributionEnabledForCommunity: Em.computed(function(): boolean {
			var dbName = Em.get(Mercury, 'wiki.dbName');

			var enabledCommunities = [
				'clashofclans', 'declashofclans', 'zhclashofclans723', 'frclashofclans',
				'ruclashofclans', 'esclashofclans727', 'ptbrclashofclans'
			];

			if (this.get('isJapaneseWikia')) {
				// Enabled for all Japanese wikias
				return true;
			} else if (enabledCommunities.indexOf(dbName) > -1) {
				// Otherwise check against whitelist
				return true;
			}

			return false;
		}),

		/**
		 * Checks if mobile contribution features are enabled.
		 * Contribution features include section editor and photo upload.
		 *
		 * @returns {boolean} True if the contribution features should be rendered on the page
		 */
		contributionEnabled: Em.computed('model.isMainPage', function (): boolean {
			return !this.get('model.isMainPage') &&
				this.get('contributionEnabledForCommunity');
		}),

		/**
		 * Determine if the upload photo icon should be rendered.
		 * Only enabled for Japanese wikias
		 *
		 * @returns {boolean} True if the upload photo icon should be rendered
		 */
		addPhotoIconVisible: Em.computed.oneWay('isJapaneseWikia'),

		/**
		 * Determine if the edit section icon should be rendered
		 *
		 * @returns {boolean} True if the edit icon should be rendered
		 */
		editIconVisible: Em.computed.oneWay('contributionEnabled'),

		/**
		 * For section editor, checks if the user is allowed to edit
		 * - Logged in users are always allowed to edit
		 * - Wikias with disableAnonymousEditing set need login to edit
		 * - Coppa wikias (for wikias directed at children) always require login to edit
		 *
		 * @returns {boolean} True if edit is allowed
		 */
		editAllowed: Em.computed(function(): boolean {
			var isCoppaWiki = Em.get(Mercury, 'wiki.isCoppaWiki'),
				disableAnonymousEditing = Em.get(Mercury, 'wiki.disableAnonymousEditing'),
				isLoggedIn = Em.get(Mercury, 'currentUser.isAuthenticated');

			if (isLoggedIn) {
				return true;
			} else {
				return !(isCoppaWiki || disableAnonymousEditing);
			}
		}),

		/**
		 * For add photo, check if the user is allowed to upload
		 * - Logged in users are always allowed to add photo
		 * - Wikias with disableAnonymousUploadForMercury set need login to add photo
		 *
		 * @returns {boolean} True if add photo is allowed
		 */
		addPhotoAllowed: Em.computed(function(): boolean {
			var disableAnonymousUploadForMercury = Em.get(Mercury, 'wiki.disableAnonymousUploadForMercury'),
				isLoggedIn = Em.get(Mercury, 'currentUser.isAuthenticated');

			if (isLoggedIn) {
				return true;
			} else {
				return !disableAnonymousUploadForMercury;
			}
		}),

		curatedContentToolButtonVisible: Em.computed.and('model.isMainPage', 'currentUser.rights.curatedcontent'),

		articleObserver: Em.observer('model.article', function (): void {
			// This check is here because this observer will actually be called for views wherein the state is actually
			// not valid, IE, the view is in the process of preRender
			Em.run.scheduleOnce('afterRender', this, this.performArticleTransforms);
		}).on('willInsertElement'),

		actions: {
			/**
			 * @param {string} title
			 * @param {number} sectionIndex
			 * @returns {void}
			 */
			edit(title: string, sectionIndex: number): void {
				this.sendAction('edit', title, sectionIndex);
			},

			/**
			 * @param {string} title
			 * @param {number} sectionIndex
			 * @param {*} photoData
			 * @returns {void}
			 */
			addPhoto(title: string, sectionIndex: number, photoData: any): void {
				this.sendAction('addPhoto', title, sectionIndex, photoData);
			},

			/**
			 * @returns {void}
			 */
			expandSideNav(): void {
				this.sendAction('toggleSideNav', true);
			},

			/**
			 * @param {string} lightboxType
			 * @param {*} lightboxData
			 * @returns {void}
			 */
			openLightbox(lightboxType: string, lightboxData: any): void {
				this.sendAction('openLightbox', lightboxType, lightboxData);
			},

			/**
			 * @param {ArticleSectionHeader[]} headers
			 * @returns {void}
			 */
			updateHeaders(headers: ArticleSectionHeader[]): void {
				this.set('headers', headers);
			},
		},

		/**
		 * @returns {void}
		 */
		didInsertElement(): void {
			$(window).off('scroll.mercury.preload');
			window.scrollTo(0, M.prop('scroll'));

			Em.run.scheduleOnce('afterRender', this, (): void => {
				this.sendAction('articleRendered');
			});
		},

		/**
		 * Handle clicks on media and bubble up to Application if anything else was clicked
		 *
		 * @param {MouseEvent} event
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

		/**
		 * @returns {boolean}
		 */
		performArticleTransforms(): boolean {
			var model = this.get('model'),
				articleContent = model.get('content');

			if (articleContent && articleContent.length > 0) {
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
		 * Returns true if handleMedia() should be executed
		 *
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
		 * @param {HTMLElement} target
		 * @returns {void}
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
		},
	}
);
