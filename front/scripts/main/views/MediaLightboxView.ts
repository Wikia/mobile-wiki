/// <reference path="./LightboxView.ts" />
/// <reference path="../../../../typings/hammerjs/hammerjs" />
/// <reference path="../../mercury/modules/VideoLoader.ts" />
/// <reference path="../mixins/ArticleContentMixin.ts" />
/// <reference path="../mixins/LightboxMixin.ts" />
'use strict';

interface Window {
	scrollY: number;
}

App.MediaLightboxView = App.LightboxView.extend(App.ArticleContentMixin, App.LightboxMixin, {
	classNames: ['media-lightbox'],
	maxZoom: 5,
	lastX: 0,
	lastY: 0,
	lastScale: 1,
	videoPlayer: null,

	isGallery: Em.computed.alias('controller.isGallery'),
	isZoomed: Em.computed.gt('scale', 1),

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
	 * @desc Checks if a currently displayed media is of a given type
	 * @param {string} type e.g, image / video
	 * @returns {boolean}
	 */
	isCurrentMediaType (type: string): boolean {
		return this.get('controller').get('currentMedia').type === type;
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

	/**
	 * @desc Changes currently displayed item based on a place that was tapped
	 * Currently 33%-wide sides of the screen trigger the media change
	 *
	 * @param {Touch} event
	 */
	handleClick: function (event: Touch): void {
		var screenArea = this.getScreenArea(event);

		if (screenArea === this.screenAreas.right) {
			this.nextMedia();
		} else if (screenArea === this.screenAreas.left) {
			this.prevMedia();
		} else {
			this.send('toggleUI');
		}
	},

	nextMedia: function (): void {
		//this.resetZoom();
		this.get('controller').incrementProperty('currentGalleryRef');

		M.track({
			action: M.trackActions.paginate,
			category: 'lightbox',
			label: 'next'
		});
	},

	prevMedia: function (): void {
		//this.resetZoom();
		this.get('controller').decrementProperty('currentGalleryRef');

		M.track({
			action: M.trackActions.paginate,
			category: 'lightbox',
			label: 'previous'
		});
	},

	keyDown: function (event: JQueryEventObject): void {
		if (this.get('isGallery')) {
			if (event.keyCode === 39) {
				//handle right arrow
				this.nextMedia();
			} else if (event.keyCode === 37) {
				//handle left arrow
				this.prevMedia();
			}
		}

		this._super(event);
	},

	click: function (event: MouseEvent): void {
		var isImage = this.isCurrentMediaType('image'),
			isVideo = this.isCurrentMediaType('video'),
			isZoomed = this.get('isZoomed'),
			isGallery = this.get('isGallery');
		if ((isImage || isVideo) && !isZoomed && isGallery) {
			this.handleClick(event);
		} else {
			this._super(event);
		}
	},

	articleContentWidthObserver: Em.observer('articleContent.width', function (): void {
		this.notifyPropertyChange('viewportSize');
		this.notifyPropertyChange('imageWidth');
		this.notifyPropertyChange('imageHeight');

		if (this.get('videoPlayer')) {
			this.get('videoPlayer').onResize();
		}
	}),

	/**
	 * @desc used to animate image that is in article into a media lightbox
	 */
	animateMedia: function (image?: HTMLElement): void {
		if (image) {
			var $image = $(image).find('img'),
				offset = $image.offset(),
				$imageCopy = $image.clone(),
				width = $image.width(),
				viewportSize = this.get('viewportSize'),
				deviceWidth = viewportSize.width;

			//initial style, mimic the image that is in page
			$imageCopy.css({
				top: offset.top - window.scrollY + 'px',
				left: offset.left + 'px',
				width: width + 'px'
				//for static css properties see _media_lightbox.scss
			}).addClass('animated-media');

			this.$().append($imageCopy);

			//animate to full width and middle of screen
			$imageCopy.css({
				width: deviceWidth + 'px',
				//half of - device height minus height of the animated image multiplied by scale
				top: ((viewportSize.height - ($image.height() * (deviceWidth / width))) / 2) + 'px',
				left: 0
			}).one('webkitTransitionEnd, transitionend', function () {
				$imageCopy.remove();
			});
		}
	}
});
