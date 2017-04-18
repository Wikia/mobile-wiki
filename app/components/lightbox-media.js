import Ember from 'ember';
import ThirdsClickMixin from '../mixins/thirds-click';
import MediaModel from '../models/media';
import {normalizeToUnderscore} from '../utils/string';

const {Component, String, computed, inject, isArray, observer} = Ember;

export default Component.extend(
	ThirdsClickMixin,
	{
		classNames: ['lightbox-media', 'lightbox-content-inner'],
		// This is needed for keyDown event to work
		attributeBindings: ['tabindex'],
		logger: inject.service(),

		tabindex: 0,
		videoPlayer: null,

		/**
		 * gets current media from model
		 */
		current: computed('model.media', 'model.mediaRef', function () {
			const mediaModel = this.get('model.media');

			if (mediaModel instanceof MediaModel) {
				return mediaModel.find(this.get('model.mediaRef'));
			} else {
				this.get('logger').error('Media model is not an instance of MediaModel');
				return null;
			}
		}),

		/**
		 * gets current media or current media from gallery
		 */
		currentMedia: computed('current', 'isGallery', 'currentGalleryRef', function () {
			const current = this.get('current');

			return this.get('isGallery') ? current[this.get('currentGalleryRef')] : current;
		}),

		currentGalleryRef: computed('model.galleryRef', {
			get() {
				return this.get('model.galleryRef') || 0;
			},

			set(key, value) {
				const galleryLength = this.get('galleryLength') - 1;

				if (value < 0) {
					return galleryLength;
				} else if (value > galleryLength) {
					return 0;
				}

				return value;
			},
		}),

		galleryLength: computed('isGallery', 'current', function () {
			return this.get('isGallery') ? this.get('current').length : -1;
		}),

		/**
		 * checks if current displayed media is a gallery
		 */
		isGallery: computed('current', function () {
			return isArray(this.get('current'));
		}),

		/**
		 * checks if current media is a video or image and which lightbox component to render
		 */
		lightboxComponent: computed('currentMedia', function () {
			const currentMedia = this.get('currentMedia');

			return currentMedia && currentMedia.url && currentMedia.type ? `lightbox-${currentMedia.type}` : null;
		}),

		modelObserver: observer('model', 'currentMedia', function () {
			this.updateState();
		}),

		gestures: {
			/**
			 * @returns {void}
			 */
			swipeLeft() {
				if (this.get('isGallery')) {
					this.nextMedia();
				}
			},

			/**
			 * @returns {void}
			 */
			swipeRight() {
				if (this.get('isGallery')) {
					this.prevMedia();
				}
			},
		},

		/**
		 * @returns {void}
		 */
		didRender() {
			this._super(...arguments);
			this.updateState();
		},

		/**
		 * @param {MouseEvent} event
		 * @returns {void}
		 */
		click(event) {
			if (this.get('isGallery')) {
				this.callClickHandler(event, true);
			} else {
				this._super(event);
			}
		},

		/**
		 * @param {JQueryEventObject} event
		 * @returns {void}
		 */
		keyDown(event) {
			if (this.get('isGallery')) {
				if (event.keyCode === 39) {
					// handle right arrow
					this.nextMedia();
				} else if (event.keyCode === 37) {
					// handle left arrow
					this.prevMedia();
				}
			}

			this._super(event);
		},

		/**
		 * @returns {boolean}
		 */
		rightClickHandler() {
			this.nextMedia();
			return true;
		},

		/**
		 * @returns {boolean}
		 */
		leftClickHandler() {
			this.prevMedia();
			return true;
		},

		/**
		 * @returns {boolean}
		 */
		centerClickHandler() {
			// Bubble up
			return false;
		},

		/**
		 * @returns {void}
		 */
		nextMedia() {
			this.incrementProperty('currentGalleryRef');
		},

		/**
		 * @returns {void}
		 */
		prevMedia() {
			this.decrementProperty('currentGalleryRef');
		},

		/**
		 * @returns {void}
		 */
		updateState() {
			this.updateHeader();
			this.updateFooter();

			this.sendAction('setQueryParam', 'file', normalizeToUnderscore(this.get('currentMedia.title')));
		},

		/**
		 * @returns {void}
		 */
		updateHeader() {
			let header = null;

			if (this.get('isGallery')) {
				header = `${(this.get('currentGalleryRef') + 1)} / ${this.get('galleryLength')}`;
			}

			this.sendAction('setHeader', header);
		},

		/**
		 * @returns {void}
		 */
		updateFooter() {
			const currentMedia = this.get('currentMedia');

			if (currentMedia && currentMedia.caption) {
				this.sendAction('setFooter', new String.htmlSafe(currentMedia.caption));
			} else {
				this.sendAction('setFooter', null);
			}
		},
	}
);
