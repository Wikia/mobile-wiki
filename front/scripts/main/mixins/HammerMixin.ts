/// <reference path="../app.ts" />
/// <reference path="../../../../typings/hammerjs/hammerjs" />
'use strict';

App.HammerMixin = Em.Mixin.create({
	maxZoom: 5,
	lastX: 0,
	lastY: 0,
	lastScale: 1,
	isZoomed: Em.computed.gt('scale', 1),

	didInsertElement: function (): void {
		var hammerInstance = this.get('_hammerInstance');
		//disabled for now, we can make it better when we have time
		//this.animateMedia(this.get('controller').get('element'));
		this.resetZoom();

		hammerInstance.get('pinch').set({
			enable: true
		});

		hammerInstance.get('pan').set({
			direction: Hammer.DIRECTION_ALL
		});
	},


	click: function (event: MouseEvent): boolean {
		console.log("click HammerMixin");

		var isZoomed = this.get('isZoomed');
		console.log("isZoomed: ", isZoomed)
		if (!isZoomed) {
			return true;
		} else {
			return false;
		}
	},

	style: Em.computed(function (): string {
		return ('-webkit-transform: scale(%@1) translate3d(%@2px,%@3px,0);' +
				' transform: scale(%@1) translate3d(%@2px,%@3px,0);')
			.fmt(
				this.get('scale').toFixed(2),
				this.get('newX').toFixed(2),
				this.get('newY').toFixed(2)
			);
		//Performance critical place
		//We will update property 'manually' by calling notifyPropertyChange
	}),

	viewportSize: Em.computed(function () {
		return {
			width: Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
			height: Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
		};
	}),

	//Easy to port if we find a way to use enum here
	screenAreas:  {
		left: 0,
		center: 1,
		right: 2
	},

	/**
	 * @desc calculates current scale for zooming
	 */
	scale: Em.computed(function (key: string, value?: number): any {
		if (value >= 1) {
			return Math.min(this.maxZoom, value);
		}

		return 1;
	}),

	/**
	 * @desc property that holds current image
	 */
	image: Em.computed(function (): JQuery {
		return this.$('.current');
	}),

	imageWidth: Em.computed('image', 'scale', function (): number {
		return this.get('image').width() * this.get('scale');
	}),

	imageHeight: Em.computed('image', 'scale', function (): number {
		return this.get('image').height() * this.get('scale');
	}),

	/**
	 * @desc used to set X boundaries for panning image in media lightbox
	 */
	maxX: Em.computed('viewportSize', 'imageWidth', 'scale', function (): number {
		return Math.abs(this.get('viewportSize').width - this.get('imageWidth')) / 2 / this.get('scale');
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
	newX: Em.computed('viewportSize', 'imageWidth', function (key: string, value?: number): number {
		if (typeof value !== 'undefined' && this.get('imageWidth') > this.get('viewportSize').width) {
			return this.limit(value, this.get('maxX'));
		}

		return 0;
	}),

	/**
	 * @desc calculates Y for panning with respect to maxY
	 */
	newY: Em.computed('viewportSize', 'imageHeight', function (key: string, value?: number): number {
		if (typeof value !== 'undefined' && this.get('imageHeight') > this.get('viewportSize').height) {
			return this.limit(value, this.get('maxY'));
		}

		return 0;
	}),

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
		/**
	 * @desc Checks on which area on the screen an event took place
	 * @param {Touch} event
	 * @returns {number}
	 */
	getScreenArea: function (event: Touch): number {
		var viewportWidth = this.get('viewportSize').width,
			x = event.clientX,
			thirdPartOfScreen = viewportWidth / 3;

		if (x < thirdPartOfScreen) {
			return this.screenAreas.left;
		} else if (x > viewportWidth - thirdPartOfScreen) {
			return this.screenAreas.right;
		} else {
			return this.screenAreas.center;
		}
	},

	gestures: {
		swipeLeft: function (): void {
			if (this.get('isGallery') && !this.get('isZoomed')) {
				this.nextMedia();
			}
		},

		swipeRight: function (): void {
			if (this.get('isGallery') && !this.get('isZoomed')) {
				this.prevMedia();
			}
		},

		pan: function (event: HammerInput): void {
			var scale = this.get('scale');

			this.setProperties({
				newX: this.get('lastX') + event.deltaX / scale,
				newY: this.get('lastY') + event.deltaY / scale
			});

			this.notifyPropertyChange('style');
		},

		panEnd: function (): void {
			this.setProperties({
				lastX: this.get('newX'),
				lastY: this.get('newY')
			});
		},

		doubleTap: function (event: HammerInput): void {
			//allow tap-to-zoom everywhere on non-galleries and in the center area for galleries
			if (!this.get('isGallery') || this.getScreenArea(event) === this.screenAreas.center) {
				var scale = this.get('scale') > 1 ? 1 : 3;

				this.setProperties({
					scale: scale,
					lastScale: scale
				});

				this.notifyPropertyChange('style');
			}
		},

		pinchMove: function (event: HammerInput): void {
			var scale = this.get('scale');

			this.setProperties({
				scale: this.get('lastScale') * event.scale,
				newX: this.get('lastX') + event.deltaX / scale,
				newY: this.get('lastY') + event.deltaY / scale
			});

			this.notifyPropertyChange('style');
		},

		pinchEnd: function (event: HammerInput): void {
			this.set('lastScale', this.get('lastScale') * event.scale);
		}
	}
});
