/**
 * @typedef {Object} ArticleSectionHeader
 * @property {HTMLElement} element
 * @property {string} level
 * @property {string} name
 * @property {string} [id]
 * @property {string} section
 */

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
			swipeLeft(event) {
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
			swipeRight(event) {
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

		uploadFeatureEnabled: Em.computed(() => {
			return !Em.get(Mercury, 'wiki.disableAnonymousUploadForMercury');
		}),

		contributionFeatureEnabled: Em.computed('model.isMainPage', function () {
			return (
				!this.get('model.isMainPage') &&
				this.get('isJapaneseWikia') && !Em.get(Mercury, 'wiki.disableAnonymousEditing')
			);
		}),

		curatedContentToolButtonVisible: Em.computed.and('model.isMainPage', 'currentUser.rights.curatedcontent'),

		articleObserver: Em.observer('model.article', function () {
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
			edit(title, sectionIndex) {
				this.sendAction('edit', title, sectionIndex);
			},

			/**
			 * @param {string} title
			 * @param {number} sectionIndex
			 * @param {*} photoData
			 * @returns {void}
			 */
			addPhoto(title, sectionIndex, photoData) {
				this.sendAction('addPhoto', title, sectionIndex, photoData);
			},

			/**
			 * @returns {void}
			 */
			expandSideNav() {
				this.sendAction('toggleSideNav', true);
			},

			/**
			 * @param {string} lightboxType
			 * @param {*} lightboxData
			 * @returns {void}
			 */
			openLightbox(lightboxType, lightboxData) {
				this.sendAction('openLightbox', lightboxType, lightboxData);
			},

			/**
			 * @param {ArticleSectionHeader[]} headers
			 * @returns {void}
			 */
			updateHeaders(headers) {
				this.set('headers', headers);
			},
		},

		/**
		 * @returns {void}
		 */
		didInsertElement() {
			$(window).off('scroll.mercury.preload');
			window.scrollTo(0, M.prop('scroll'));

			Em.run.scheduleOnce('afterRender', this, () => {
				this.sendAction('articleRendered');
			});
		},

		/**
		 * Handle clicks on media and bubble up to Application if anything else was clicked
		 *
		 * @param {MouseEvent} event
		 * @returns {boolean}
		 */
		click(event) {
			const $anchor = Em.$(event.target).closest('a');

			let target;

			// Here, we want to handle media only, no links
			if ($anchor.length === 0) {
				target = event.target;

				if (this.shouldHandleMedia(target, target.tagName.toLowerCase())) {
					this.handleMedia(target);
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
		performArticleTransforms() {
			const model = this.get('model'),
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
		shouldHandleMedia(target, tagName) {
			return (tagName === 'img' || tagName === 'figure') && $(target).children('a').length === 0;
		},

		/**
		 * Opens media lightbox for given target
		 *
		 * @param {HTMLElement} target
		 * @returns {void}
		 */
		handleMedia(target) {
			const $target = $(target),
				galleryRef = $target.closest('[data-gallery-ref]').data('gallery-ref'),
				$mediaElement = $target.closest('[data-ref]'),
				mediaRef = $mediaElement.data('ref');

			let media;

			if (mediaRef >= 0) {
				Em.Logger.debug('Handling media:', mediaRef, 'gallery:', galleryRef);

				if (!$mediaElement.hasClass('is-small')) {
					media = this.get('model.media');
					this.sendAction('openLightbox', 'media', {
						media,
						mediaRef,
						galleryRef
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
