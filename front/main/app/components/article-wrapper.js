import Ember from 'ember';
import HeroImageMixin from '../mixins/hero-image';
import LanguagesMixin from '../mixins/languages';
import ViewportMixin from '../mixins/viewport';
import {track, trackActions} from 'common/utils/track';

/**
 * @typedef {Object} ArticleSectionHeader
 * @property {HTMLElement} element
 * @property {string} level
 * @property {string} name
 * @property {string} [id]
 * @property {string} section
 */

export default Ember.Component.extend(
	HeroImageMixin,
	LanguagesMixin,
	ViewportMixin,
	{
		classNames: ['article-wrapper'],
		currentUser: Ember.inject.service(),
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

		/**
		 * Checks if contribution component should be enabled
		 *
		 * @returns {boolean} True if contribution component is enabled for this community
		 */
		contributionEnabledForCommunity: Ember.computed(() => {
			if (Ember.getWithDefault(Mercury, 'wiki.disableMobileSectionEditor', false)) {
				// When disableMobileSectionEditor is set to true, no contribution tools should show up
				return false;
			}

			return true;
		}),

		/**
		 * Checks if mobile contribution features are enabled.
		 * Contribution features include section editor and photo upload.
		 *
		 * @returns {boolean} True if the contribution features should be rendered on the page
		 */
		contributionEnabled: Ember.computed('model.isMainPage', function () {
			return !this.get('model.isMainPage') &&
				this.get('contributionEnabledForCommunity') &&
				// @todo XW-1196: Enable article editing on category pages
				this.getWithDefault('model.ns', 0) !== 14;
		}),

		/**
		 * Determine if the upload photo icon should be rendered.
		 * Only enabled for Japanese wikias
		 *
		 * @returns {boolean} True if the upload photo icon should be rendered
		 */
		addPhotoIconVisible: Ember.computed.oneWay('isJapaneseWikia'),

		/**
		 * Determine if the edit section icon should be rendered
		 *
		 * @returns {boolean} True if the edit icon should be rendered
		 */
		editIconVisible: Ember.computed.oneWay('contributionEnabled'),

		/**
		 * For section editor, checks if the user is allowed to edit
		 * - Logged in users are always allowed to edit
		 * - Wikias with disableAnonymousEditing set need login to edit
		 * - Coppa wikias (for wikias directed at children) always require login to edit
		 *
		 * @returns {boolean} True if edit is allowed
		 */
		editAllowed: Ember.computed(function () {
			const isCoppaWiki = Ember.getWithDefault(Mercury, 'wiki.isCoppaWiki', false),
				disableAnonymousEditing = Ember.getWithDefault(Mercury, 'wiki.disableAnonymousEditing', false),
				isLoggedIn = this.get('currentUser.isAuthenticated');

			if (isLoggedIn) {
				return true;
			} else {
				return !(isCoppaWiki || disableAnonymousEditing);
			}
		}),

		/**
		 * For add photo, check if the user is allowed to upload
		 * Only logged in users are allowed to add photo
		 *
		 * @returns {boolean} True if add photo is allowed
		 */
		addPhotoAllowed: Ember.computed(function () {
			return this.get('currentUser.isAuthenticated');
		}),

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
			 * @param {string} lightboxType
			 * @param {*} lightboxData
			 * @returns {void}
			 */
			openLightbox(lightboxType, lightboxData) {
				this.sendAction('openLightbox', lightboxType, lightboxData);
			},

			trackClick(category, label) {
				track({
					action: trackActions.click,
					category,
					label
				});
			}
		},

		/**
		 * @returns {void}
		 */
		didInsertElement() {
			$(window).off('scroll.mercury.preload');
			window.scrollTo(0, M.prop('scroll'));

			Ember.run.scheduleOnce('afterRender', this, () => {
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
			const $anchor = Ember.$(event.target).closest('a');

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
				Ember.Logger.debug('Handling media:', mediaRef, 'gallery:', galleryRef);

				media = this.get('model.media');

				track({
					action: trackActions.click,
					category: 'media',
					label: 'open'
				});

				this.sendAction('openLightbox', 'media', {
					media,
					mediaRef,
					galleryRef
				});
			} else {
				Ember.Logger.debug('Missing ref on', target);
			}
		}
	}
);
