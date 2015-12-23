import Ember from 'ember';
import ArticleContentMixin from '../mixins/article-content';

export default Ember.Component.extend(
	ArticleContentMixin,
	{
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
			right: 2,
		},

		isZoomed: Ember.computed.gt('scale', 1),
		loadingError: false,

		/**
		 * This is performance critical place, we will update property 'manually' by calling notifyPropertyChange
		 */
		style: Ember.computed(function () {
			const scale = this.get('scale').toFixed(2),
				x = this.get('newX').toFixed(2),
				y = this.get('newY').toFixed(2),
				transform = `transform: scale(${scale}) translate3d(${x}px,${y}px,0);`;

			return (`-webkit-${transform}${transform}`).htmlSafe();
		}),

		viewportSize: Ember.computed(() => {
			return {
				width: Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
				height: Math.max(document.documentElement.clientHeight, window.innerHeight || 0),
			};
		}),

		/**
		 * calculates current scale for zooming
		 */
		limitedScale: Ember.computed('scale', {
			get() {
				return this.get('scale');
			},

			set(key, value) {
				let scale = 1;

				if (value >= 1) {
					scale = Math.min(this.maxZoom, value);
				}

				this.set('scale', scale);
			},
		}),

		/**
		 * property that holds current image
		 */
		image: Ember.computed(function () {
			return this.$('.current');
		}),

		imageWidth: Ember.computed('image', 'scale', function () {
			const $image = this.get('image');

			let imageWidth = 0;

			if ($image) {
				imageWidth = $image.width() * this.get('scale');
			}

			return imageWidth;
		}),

		imageHeight: Ember.computed('image', 'scale', function () {
			const $image = this.get('image');

			let imageHeight = 0;

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
			get() {
				return this.get('newX');
			},

			set(key, value) {
				let newX = 0;

				if (this.get('imageWidth') > this.get('viewportSize.width')) {
					newX = this.limit(value, this.get('maxX'));
				}

				this.set('newX', newX);
			},
		}),

		/**
		 * calculates Y for panning with respect to maxY
		 */
		limitedNewY: Ember.computed('newY', 'viewportSize', 'imageHeight', {
			get() {
				return this.get('newY');
			},

			set(key, value) {
				let newY = 0;

				if (this.get('imageHeight') > this.get('viewportSize.height')) {
					newY = this.limit(value, this.get('maxY'));
				}

				this.set('newY', newY);
			},
		}),

		articleContentWidthObserver: Ember.observer('articleContent.width', function () {
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
			swipeLeft() {
				return !this.get('isZoomed');
			},

			/**
			 * @returns {boolean}
			 */
			swipeRight() {
				return !this.get('isZoomed');
			},

			/**
			 * @param {HammerInput} event
			 * @returns {void}
			 */
			pan(event) {
				const scale = this.get('scale');

				this.setProperties({
					limitedNewX: this.get('lastX') + event.deltaX / scale,
					limitedNewY: this.get('lastY') + event.deltaY / scale,
				});

				this.notifyPropertyChange('style');
			},

			/**
			 * @returns {void}
			 */
			panEnd() {
				this.setProperties({
					lastX: this.get('newX'),
					lastY: this.get('newY')
				});
			},

			/**
			 * @param {HammerInput} event
			 * @returns {void}
			 */
			doubleTap(event) {
				// Allow tap-to-zoom everywhere on non-galleries and in the center area for galleries
				if (
					!this.get('isZoomed') &&
					(!this.get('isGallery') || this.getScreenArea(event) === this.screenAreas.center)
				) {
					const scale = 3;

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
			pinchMove(event) {
				const scale = this.get('scale');

				this.setProperties({
					limitedScale: this.get('lastScale') * event.scale,
					limitedNewX: this.get('lastX') + event.deltaX / scale,
					limitedNewY: this.get('lastY') + event.deltaY / scale,
				});

				this.notifyPropertyChange('style');
			},

			/**
			 * @param {HammerInput} event
			 * @returns {void}
			 */
			pinchEnd(event) {
				this.set('lastScale', this.get('lastScale') * event.scale);
			},
		},

		/**
		 * @returns {void}
		 */
		loadUrl() {
			const url = this.get('model.url');

			if (url) {
				this.load(url);
			}

			this.resetZoom();
		},

		/**
		 * @returns {void}
		 */
		didInsertElement() {
			const hammerInstance = this.get('_hammerInstance');

			hammerInstance.get('pinch').set({
				enable: true
			});

			hammerInstance.get('pan').set({
				direction: Hammer.DIRECTION_ALL
			});

			Ember.run.scheduleOnce('afterRender', this, () => {
				this.loadUrl();
			});
		},

		/**
		 * Handle click and prevent bubbling
		 * if the image is zoomed
		 *
		 * @returns {boolean}
		 */
		click() {
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
		limit(value, max) {
			if (value < 0) {
				return Math.max(value, -max);
			} else {
				return Math.min(value, max);
			}
		},

		/**
		 * @returns {void}
		 */
		resetZoom() {
			this.setProperties({
				scale: 1,
				lastScale: 1,
				newX: 0,
				newY: 0,
				lastX: 0,
				lastY: 0,
			});
		},

		/**
		 * load an image and run update function when it is loaded
		 *
		 * @param {string} url url of current image
		 * @returns {void}
		 */
		load(url) {
			const image = new Image();

			this.set('isLoading', true);
			image.src = url;

			if (image.complete) {
				this.update(image.src);
			} else {
				image.addEventListener('load', () => {
					this.update(image.src);
				});

				image.addEventListener('error', () => {
					this.update('', true);
				});
			}
		},

		/**
		 * Updates img with its src or displays error
		 *
		 * @param {string} imageSrc
		 * @param {boolean} [loadingError=false]
		 * @returns {void}
		 */
		update(imageSrc, loadingError = false) {
			if (!this.get('isDestroyed')) {
				this.setProperties({
					imageSrc,
					isLoading: false,
					loadingError,
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
		getScreenArea(event) {
			const viewportWidth = this.get('viewportSize.width'),
				x = event.center.x,
				thirdPartOfScreen = viewportWidth / 3;

			if (x < thirdPartOfScreen) {
				return this.screenAreas.left;
			} else if (x > viewportWidth - thirdPartOfScreen) {
				return this.screenAreas.right;
			} else {
				return this.screenAreas.center;
			}
		},
	}
);
