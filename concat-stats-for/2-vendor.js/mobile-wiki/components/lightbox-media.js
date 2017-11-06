define('mobile-wiki/components/lightbox-media', ['exports', 'mobile-wiki/mixins/thirds-click', 'mobile-wiki/models/media', 'mobile-wiki/utils/string'], function (exports, _thirdsClick, _media, _string) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var Component = Ember.Component,
	    htmlSafe = Ember.String.htmlSafe,
	    computed = Ember.computed,
	    inject = Ember.inject,
	    isArray = Ember.isArray,
	    observer = Ember.observer;
	exports.default = Component.extend(_thirdsClick.default, {
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
			var mediaModel = this.get('model.media');

			if (mediaModel instanceof _media.default) {
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
			var current = this.get('current');

			return this.get('isGallery') ? current[this.get('currentGalleryRef')] : current;
		}),

		currentGalleryRef: computed('model.galleryRef', {
			get: function get() {
				return this.get('model.galleryRef') || 0;
			},
			set: function set(key, value) {
				var galleryLength = this.get('galleryLength') - 1;

				if (value < 0) {
					return galleryLength;
				} else if (value > galleryLength) {
					return 0;
				}

				return value;
			}
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
			var currentMedia = this.get('currentMedia');

			return currentMedia && currentMedia.url && currentMedia.type ? 'lightbox-' + currentMedia.type : null;
		}),

		modelObserver: observer('model', 'currentMedia', function () {
			this.updateState();
		}),

		gestures: {
			/**
    * @returns {void}
    */
			swipeLeft: function swipeLeft() {
				if (this.get('isGallery')) {
					this.nextMedia();
				}
			},


			/**
    * @returns {void}
    */
			swipeRight: function swipeRight() {
				if (this.get('isGallery')) {
					this.prevMedia();
				}
			}
		},

		/**
   * @returns {void}
   */
		didRender: function didRender() {
			this._super.apply(this, arguments);
			this.updateState();
		},


		/**
   * @param {MouseEvent} event
   * @returns {void}
   */
		click: function click(event) {
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
		keyDown: function keyDown(event) {
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
		rightClickHandler: function rightClickHandler() {
			this.nextMedia();
			return true;
		},


		/**
   * @returns {boolean}
   */
		leftClickHandler: function leftClickHandler() {
			this.prevMedia();
			return true;
		},


		/**
   * @returns {boolean}
   */
		centerClickHandler: function centerClickHandler() {
			// Bubble up
			return false;
		},


		/**
   * @returns {void}
   */
		nextMedia: function nextMedia() {
			this.incrementProperty('currentGalleryRef');
		},


		/**
   * @returns {void}
   */
		prevMedia: function prevMedia() {
			this.decrementProperty('currentGalleryRef');
		},


		/**
   * @returns {void}
   */
		updateState: function updateState() {
			this.updateHeader();
			this.updateFooter();

			this.sendAction('setQueryParam', 'file', (0, _string.normalizeToUnderscore)(this.get('currentMedia.title')));
		},


		/**
   * @returns {void}
   */
		updateHeader: function updateHeader() {
			var header = null;

			if (this.get('isGallery')) {
				header = this.get('currentGalleryRef') + 1 + ' / ' + this.get('galleryLength');
			}

			this.sendAction('setHeader', header);
		},


		/**
   * @returns {void}
   */
		updateFooter: function updateFooter() {
			var currentMedia = this.get('currentMedia');

			if (currentMedia && currentMedia.caption) {
				this.sendAction('setFooter', new htmlSafe(currentMedia.caption));
			} else {
				this.sendAction('setFooter', null);
			}
		}
	});
});