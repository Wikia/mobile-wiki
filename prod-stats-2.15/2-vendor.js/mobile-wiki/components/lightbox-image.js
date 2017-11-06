define('mobile-wiki/components/lightbox-image', ['exports', 'mobile-wiki/mixins/viewport', 'mobile-wiki/mixins/image-loader'], function (exports, _viewport, _imageLoader) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = Ember.Component.extend(_viewport.default, _imageLoader.default, {
		classNames: ['lightbox-image', 'lightbox-content-inner'],
		maxZoom: 5,
		newX: 0,
		newY: 0,
		lastX: 0,
		lastY: 0,
		lastScale: 1,
		scale: 1,

		// Easy to port if we find a way to use enum here
		screenAreas: {
			left: 0,
			center: 1,
			right: 2
		},

		isZoomed: Ember.computed.gt('scale', 1),
		loadingError: false,

		/**
   * This is performance critical place, we will update property 'manually' by calling notifyPropertyChange
   */
		style: Ember.computed(function () {
			var scale = this.get('scale').toFixed(2),
			    x = this.get('newX').toFixed(2),
			    y = this.get('newY').toFixed(2),
			    transform = 'transform: scale(' + scale + ') translate3d(' + x + 'px,' + y + 'px,0);';

			return Ember.String.htmlSafe('-webkit-' + transform + transform);
		}),

		viewportSize: Ember.computed(function () {
			return {
				width: Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
				height: Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
			};
		}),

		/**
   * calculates current scale for zooming
   */
		limitedScale: Ember.computed('scale', {
			get: function get() {
				return this.get('scale');
			},
			set: function set(key, value) {
				var scale = 1;

				if (value >= 1) {
					scale = Math.min(this.maxZoom, value);
				}

				this.set('scale', scale);
			}
		}),

		/**
   * property that holds current image
   */
		image: Ember.computed(function () {
			return this.$('.current');
		}),

		imageWidth: Ember.computed('image', 'scale', function () {
			var $image = this.get('image');

			var imageWidth = 0;

			if ($image) {
				imageWidth = $image.width() * this.get('scale');
			}

			return imageWidth;
		}),

		imageHeight: Ember.computed('image', 'scale', function () {
			var $image = this.get('image');

			var imageHeight = 0;

			if ($image) {
				imageHeight = this.get('image').height() * this.get('scale');
			}

			return imageHeight;
		}),

		/**
   * used to set X boundaries for panning image in media lightbox
   */
		maxX: Ember.computed('viewportSize', 'imageWidth', 'scale', function () {
			return Math.abs(this.get('viewportSize.width') - this.get('imageWidth')) / 2 / this.get('scale');
		}),

		/**
   * used to set Y boundaries for panning image in media lightbox
   */
		maxY: Ember.computed('viewportSize', 'imageHeight', 'scale', function () {
			return Math.abs(this.get('viewportSize').height - this.get('imageHeight')) / 2 / this.get('scale');
		}),

		/**
   * calculates X for panning with respect to maxX
   */
		limitedNewX: Ember.computed('newX', 'viewportSize', 'imageWidth', {
			get: function get() {
				return this.get('newX');
			},
			set: function set(key, value) {
				var newX = 0;

				if (this.get('imageWidth') > this.get('viewportSize.width')) {
					newX = this.limit(value, this.get('maxX'));
				}

				this.set('newX', newX);
			}
		}),

		/**
   * calculates Y for panning with respect to maxY
   */
		limitedNewY: Ember.computed('newY', 'viewportSize', 'imageHeight', {
			get: function get() {
				return this.get('newY');
			},
			set: function set(key, value) {
				var newY = 0;

				if (this.get('imageHeight') > this.get('viewportSize.height')) {
					newY = this.limit(value, this.get('maxY'));
				}

				this.set('newY', newY);
			}
		}),

		articleContentWidthObserver: Ember.observer('viewportDimensions.width', function () {
			this.notifyPropertyChange('viewportSize');
			this.notifyPropertyChange('imageWidth');
			this.notifyPropertyChange('imageHeight');
		}),

		urlObserver: Ember.observer('model.url', function () {
			this.loadUrl();
		}),

		gestures: {
			/**
    * @returns {boolean}
    */
			swipeLeft: function swipeLeft() {
				return !this.get('isZoomed');
			},


			/**
    * @returns {boolean}
    */
			swipeRight: function swipeRight() {
				return !this.get('isZoomed');
			},


			/**
    * @param {HammerInput} event
    * @returns {void}
    */
			pan: function pan(event) {
				var scale = this.get('scale');

				this.setProperties({
					limitedNewX: this.get('lastX') + event.deltaX / scale,
					limitedNewY: this.get('lastY') + event.deltaY / scale
				});

				this.notifyPropertyChange('style');
			},


			/**
    * @returns {void}
    */
			panEnd: function panEnd() {
				this.setProperties({
					lastX: this.get('newX'),
					lastY: this.get('newY')
				});
			},


			/**
    * @param {HammerInput} event
    * @returns {void}
    */
			doubleTap: function doubleTap(event) {
				// Allow tap-to-zoom everywhere on non-galleries and in the center area for galleries
				if (!this.get('isZoomed') && (!this.get('isGallery') || this.getScreenArea(event) === this.screenAreas.center)) {
					var scale = 3;

					this.setProperties({
						limitedScale: scale,
						lastScale: scale
					});
				} else {
					this.resetZoom();
				}

				this.notifyPropertyChange('style');
			},


			/**
    * @param {HammerInput} event
    * @returns {void}
    */
			pinchMove: function pinchMove(event) {
				var scale = this.get('scale');

				this.setProperties({
					limitedScale: this.get('lastScale') * event.scale,
					limitedNewX: this.get('lastX') + event.deltaX / scale,
					limitedNewY: this.get('lastY') + event.deltaY / scale
				});

				this.notifyPropertyChange('style');
			},


			/**
    * @param {HammerInput} event
    * @returns {void}
    */
			pinchEnd: function pinchEnd(event) {
				this.set('lastScale', this.get('lastScale') * event.scale);
			}
		},

		/**
   * @returns {void}
   */
		loadUrl: function loadUrl() {
			var _this = this;

			var url = this.get('model.url');

			if (url) {
				this.load(url).then(function (imageSrc) {
					_this.update(imageSrc);
				}).catch(function () {
					_this.update('', true);
				});
			}

			this.resetZoom();
		},


		/**
   * @returns {void}
   */
		didInsertElement: function didInsertElement() {
			var _this2 = this;

			var hammerInstance = this.get('_hammerInstance');

			hammerInstance.get('pinch').set({
				enable: true
			});

			hammerInstance.get('pan').set({
				direction: Hammer.DIRECTION_ALL
			});

			Ember.run.scheduleOnce('afterRender', this, function () {
				_this2.loadUrl();
			});
		},


		/**
   * Handle click and prevent bubbling
   * if the image is zoomed
   *
   * @returns {boolean}
   */
		click: function click() {
			return !this.get('isZoomed');
		},


		/**
   * returns limited value for given max ie.
   * value = 5, max = 6, return 5
   * value = 6, max = 3, return 3
   * value = -5, max = -6, return -5
   * value = -6, max = -3, return -3
   *
   * @param {number} value
   * @param {number} max
   * @returns {number}
   */
		limit: function limit(value, max) {
			if (value < 0) {
				return Math.max(value, -max);
			} else {
				return Math.min(value, max);
			}
		},


		/**
   * @returns {void}
   */
		resetZoom: function resetZoom() {
			this.setProperties({
				scale: 1,
				lastScale: 1,
				newX: 0,
				newY: 0,
				lastX: 0,
				lastY: 0
			});
		},


		/**
   * Updates img with its src or displays error
   *
   * @param {string} imageSrc
   * @param {boolean} [loadingError=false]
   * @returns {void}
   */
		update: function update(imageSrc) {
			var loadingError = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

			if (!this.get('isDestroyed')) {
				this.setProperties({
					imageSrc: imageSrc,
					isLoading: false,
					loadingError: loadingError,
					visible: true
				});
			}
		},


		/**
   * Checks on which area on the screen an event took place
   *
   * @param {HammerInput} event
   * @returns {number}
   */
		getScreenArea: function getScreenArea(event) {
			var viewportWidth = this.get('viewportSize.width'),
			    x = event.center.x,
			    thirdPartOfScreen = viewportWidth / 3;

			if (x < thirdPartOfScreen) {
				return this.screenAreas.left;
			} else if (x > viewportWidth - thirdPartOfScreen) {
				return this.screenAreas.right;
			} else {
				return this.screenAreas.center;
			}
		}
	});
});