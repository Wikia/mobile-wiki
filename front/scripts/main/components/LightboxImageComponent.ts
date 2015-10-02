/// <reference path="../app.ts" />
/// <reference path="../../../../typings/hammerjs/hammerjs" />
/// <reference path="../mixins/ArticleContentMixin.ts" />
'use strict';

App.LightboxImageComponent = Em.Component.extend(App.ArticleContentMixin, {
	classNames: ['lightbox-image', 'lightbox-content-inner'],
	maxZoom: 5,
	newX: 0,
	newY: 0,
	lastX: 0,
	lastY: 0,
	lastScale: 1,
	scale: 1,

	//Easy to port if we find a way to use enum here
	screenAreas:  {
		left: 0,
		center: 1,
		right: 2
	},

	isZoomed: Em.computed.gt('scale', 1),
	loadingError: false,

	/**
	 * @desc This is performance critical place, we will update property 'manually' by calling notifyPropertyChange
	 */
	style: Em.computed(function (): Em.Handlebars.SafeString {
		var scale = this.get('scale').toFixed(2),
			x = this.get('newX').toFixed(2),
			y = this.get('newY').toFixed(2),
			transform = `transform: scale(${scale}) translate3d(${x}px,${y}px,0);`;

		return ('-webkit-' + transform + transform).htmlSafe();
	}),

	viewportSize: Em.computed(function () {
		return {
			width: Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
			height: Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
		};
	}),

	/**
	 * @desc calculates current scale for zooming
	 */
	limitedScale: Em.computed('scale', {
		get(): number {
			return this.get('scale');
		},
		set(key: string, value: number): void {
			var scale = 1;

			if (value >= 1) {
				scale = Math.min(this.maxZoom, value);
			}

			this.set('scale', scale);
		}
	}),

	/**
	 * @desc property that holds current image
	 */
	image: Em.computed(function (): JQuery {
		return this.$('.current');
	}),

	imageWidth: Em.computed('image', 'scale', function (): number {
		var $image = this.get('image'),
			imageWidth = 0;

		if ($image) {
			imageWidth = $image.width() * this.get('scale');
		}

		return imageWidth;
	}),

	imageHeight: Em.computed('image', 'scale', function (): number {
		var $image = this.get('image'),
			imageHeight = 0;

		if ($image) {
			imageHeight = this.get('image').height() * this.get('scale');
		}

		return imageHeight;
	}),

	/**
	 * @desc used to set X boundaries for panning image in media lightbox
	 */
	maxX: Em.computed('viewportSize', 'imageWidth', 'scale', function (): number {
		return Math.abs(this.get('viewportSize.width') - this.get('imageWidth')) / 2 / this.get('scale');
	}),

	/**
	 * @desc used to set Y boundaries for panning image in media lightbox
	 */
	maxY: Em.computed('viewportSize', 'imageHeight', 'scale', function (): number {
		return Math.abs(this.get('viewportSize').height - this.get('imageHeight')) / 2 / this.get('scale');
	}),

	/**
	 * @desc calculates X for panning with respect to maxX
	 */
	limitedNewX: Em.computed('newX', 'viewportSize', 'imageWidth', {
		get(): number {
			return this.get('newX');
		},
		set(key: string, value: string): void {
			var newX = 0;

			if (this.get('imageWidth') > this.get('viewportSize.width')) {
				newX = this.limit(value, this.get('maxX'));
			}

			this.set('newX', newX);
		}
	}),

	/**
	 * @desc calculates Y for panning with respect to maxY
	 */
	limitedNewY: Em.computed('newY', 'viewportSize', 'imageHeight', {
		get(): number {
			return this.get('newY');
		},
		set(key: string, value: string): void {
			var newY = 0;

			if (this.get('imageHeight') > this.get('viewportSize.height')) {
				newY = this.limit(value, this.get('maxY'));
			}

			this.set('newY', newY);
		}
	}),

	articleContentWidthObserver: Em.observer('articleContent.width', function (): void {
		this.notifyPropertyChange('viewportSize');
		this.notifyPropertyChange('imageWidth');
		this.notifyPropertyChange('imageHeight');
	}),

	loadUrl(): void {
		var url = this.get('model.url');

		if (url) {
			this.load(url);
		}

		this.resetZoom();
	},

	urlObserver: Em.observer('model.url', function() {
		this.loadUrl();
	}),

	didInsertElement(): void {
		var hammerInstance = this.get('_hammerInstance');

		hammerInstance.get('pinch').set({
			enable: true
		});

		hammerInstance.get('pan').set({
			direction: Hammer.DIRECTION_ALL
		});

		this.loadUrl();
	},

	/**
	 * @desc Handle click and prevent bubbling
	 * if the image is zoomed
	 */
	click(event: MouseEvent): boolean {
		var isZoomed = this.get('isZoomed');
		return isZoomed ? false : true;
	},

	gestures: {
		swipeLeft(): boolean {
			return this.get('isZoomed') ? false : true;
		},

		swipeRight(): boolean {
			return this.get('isZoomed') ? false : true;
		},

		pan(event: HammerInput): void {
			var scale = this.get('scale');

			this.setProperties({
				limitedNewX: this.get('lastX') + event.deltaX / scale,
				limitedNewY: this.get('lastY') + event.deltaY / scale
			});

			this.notifyPropertyChange('style');
		},

		panEnd(): void {
			this.setProperties({
				lastX: this.get('newX'),
				lastY: this.get('newY')
			});
		},

		doubleTap(event: HammerInput): void {
			var scale: number;

			// Allow tap-to-zoom everywhere on non-galleries and in the center area for galleries
			if (
				!this.get('isZoomed') &&
				(!this.get('isGallery') || this.getScreenArea(event) === this.screenAreas.center)
			) {
				scale = 3;

				this.setProperties({
					limitedScale: scale,
					lastScale: scale
				});
			} else {
				this.resetZoom();
			}

			this.notifyPropertyChange('style');
		},

		pinchMove(event: HammerInput): void {
			var scale = this.get('scale');

			this.setProperties({
				limitedScale: this.get('lastScale') * event.scale,
				limitedNewX: this.get('lastX') + event.deltaX / scale,
				limitedNewY: this.get('lastY') + event.deltaY / scale
			});

			this.notifyPropertyChange('style');
		},

		pinchEnd(event: HammerInput): void {
			this.set('lastScale', this.get('lastScale') * event.scale);
		}
	},

	/**
	 * @desc returns limited value for given max ie.
	 * value = 5, max = 6, return 5
	 * value = 6, max = 3, return 3
	 * value = -5, max = -6, return -5
	 * value = -6, max = -3, return -3
	 */
	limit (value: number, max: number): number {
		if (value < 0) {
			return Math.max(value, -max);
		} else {
			return Math.min(value, max);
		}
	},

	resetZoom(): void {
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
	 * @desc load an image and run update function when it is loaded
	 *
	 * @param url string - url of current image
	 */
	load(url: string): void {
		var image: HTMLImageElement = new Image();

		this.set('isLoading', true);
		image.src = url;

		if (image.complete) {
			this.update(image.src);
		} else {
			image.addEventListener('load', (): void => {
				this.update(image.src);
			});

			image.addEventListener('error', (): void => {
				this.set('loadingError', true);
				this.hideLoader();
			});
		}
	},

	/**
	 * @desc updates img with its src and sets media component to visible state
	 *
	 * @param src string - src for image
	 */
	update(src: string): void {
		this.setProperties({
			imageSrc: src,
			visible: true
		});
		this.set('isLoading', false);
	},

	/**
	 * @desc Checks on which area on the screen an event took place
	 * @param {HammerInput} event
	 * @returns {number}
	 */
	getScreenArea(event: HammerInput): number {
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
