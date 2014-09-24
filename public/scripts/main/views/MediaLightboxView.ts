/// <reference path="./LightboxView.ts" />
'use strict';

App.MediaLightboxView = App.LightboxView.extend({
	classNames: ['media-lightbox'],
	templateName: 'app/media-lightbox',
	maxZoom: 5,
	lastX: 0,
	lastY: 0,
	lastScale: 1,
	//opening, open
	//before didInsertElement the lightbox is opening
	status: 'opening',
	videoPlayer: null,

	isGallery: Em.computed.alias('controller.isGallery'),
	isZoomed: Em.computed.gt('scale', 1),

	viewportSize: function () {
		return {
			width: Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
			height: Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
		}
	}.property(),

	/**
	 * @desc calculates current scale for zooming
	 */
	scale: function (name: string, value: number): any {
		if (value >= 1) {
			return Math.min(this.maxZoom, value);
		}

		return 1;
	}.property(),

	/**
	 * @desc property that holds current image
	 */
	image: function (): JQuery {
		return this.$('.current');
	}.property(),

	imageWidth: function (): number {
		return this.get('image').width() * this.get('scale');
	}.property('image', 'scale'),

	imageHeight: function (): number {
		return this.get('image').height() * this.get('scale');
	}.property('image', 'scale'),

	/**
	 * @desc used to set X boundries for panning image in media lightbox
	 */
	maxX: function (): number {
		return Math.abs(this.get('viewportSize').width - this.get('imageWidth')) / 2 / this.get('scale');
	}.property('viewportSize', 'imageWidth', 'scale'),

	/**
	 * @desc used to set Y boundries for panning image in media lightbox
	 */
	maxY: function (): number {
		return Math.abs(this.get('viewportSize').height - this.get('imageHeight')) / 2 / this.get('scale');
	}.property('viewportSize', 'imageHeight', 'scale'),

	/**
	 * @desc calculates X for panning with respect to maxX
	 */
	newX: function (key: string, value: number): number {
		if (value && this.get('imageWidth') > this.get('viewportSize').width) {
			return this.limit(value, this.get('maxX'));
		}

		return 0;
	}.property('viewportSize', 'imageWidth'),

	/**
	 * @desc calculates Y for panning with respect to maxY
	 */
	newY: function (key: string, value: number): number {
		if (value && this.get('imageHeight') > this.get('viewportSize').height) {
			return this.limit(value, this.get('maxY'));
		}

		return 0;
	}.property('viewportSize', 'imageHeight'),

	/**
	 * @desc returns limited value for given max ie.
	 * value = 5, max = 6, return 5
	 * value = 6, max = 3, return 3
	 * value = -5, max = -6, return -5
	 * value = -6, max = -3, return -3
	 */
	limit: function (value: number, max: number): number {
		if (value < 0) {
			return Math.max(value, -max);
		} else {
			return Math.min(value, max);
		}
	},

	nextMedia: function () {
		this.get('controller').incrementProperty('currentGalleryRef');
		this.resetZoom();
	},

	prevMedia: function () {
		this.get('controller').decrementProperty('currentGalleryRef');
		this.resetZoom();
	},

	resetZoom: function () {
		this.setProperties({
			scale: 1,
			lastScale: 1,
			newX: 0,
			newY: 0,
			lastX: 0,
			lastY: 0
		});
	},

	keyDown: function (event: JQueryEventObject) {
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

		pan: function (event: {deltaX: number; deltaY: number}): void {
			var scale = this.get('scale');

			this.setProperties({
				newX: this.get('lastX') + event.deltaX / scale,
				newY: this.get('lastY') + event.deltaY / scale
			});
		},

		panEnd: function () {
			this.setProperties({
				lastX: this.get('newX'),
				lastY: this.get('newY')
			});
		},

		doubleTap: function () {
			var scale = this.get('scale') > 1 ? 1 : 3;

			this.setProperties({
				scale: scale,
				lastScale: scale
			});
		},

		pinchMove: function (event: {scale: number}) {
			var scale = this.get('scale');

			this.setProperties({
				scale: this.get('lastScale') * event.scale,
				newX: this.get('lastX') + event.deltaX / scale,
				newY: this.get('lastY') + event.deltaY / scale
			});
		},

		pinchEnd: function (event: {scale: number}) {
			this.set('lastScale', this.get('lastScale') * event.scale);
		}
	},

	/**
	 * @desc 'listens' to scale, newX and newY and returns
	 * style string for an image, used for scaling and panning
	 */
	style: function (): string {
		return 'transform: scale(%@1) translate3d(%@2px,%@3px,0);'.fmt(
			this.get('scale').toFixed(2),
			this.get('newX').toFixed(2),
			this.get('newY').toFixed(2)
		);
	}.property('scale', 'newX', 'newY'),

	/**
	 * @method currentMediaObserver
	 * @description Used to check if media if video after the lightbox current
	 * view has been updated. This is so that any specific embed markup is loaded
	 * before we try to instantiate player controls.
	 */
	currentMediaObserver: function (): void {
		var currentMedia = this.get('controller.currentMedia');

		if (currentMedia.type === 'video') {
			Em.run.scheduleOnce('afterRender', this, (): void => {
				this.initVideoPlayer(currentMedia);
			});
		}
	}.observes('controller.currentMedia'),

	/**
	 * @method initVideoPlayer
	 * @description Used to instantiate a provider specific video player
	 */
	initVideoPlayer: function (media: any): void {
		var element = this.$('.lightbox-content-inner')[0];

		this.set('videoPlayer', new Wikia.Modules.VideoLoader(element, media.embed));
	},

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
				width: deviceWidth + 'px', //half of - device height minus height of the animated image multiplied by scale
				top: ((viewportSize.height - ($image.height() * (deviceWidth / width))) / 2) + 'px',
				left: 0
			}).one('webkitTransitionEnd, transitionend', function () {
				$imageCopy.remove();
			});
		}
	},

	didInsertElement: function (): void {
		var onResize = () => {
			this.notifyPropertyChange('viewportSize');
			this.notifyPropertyChange('imageWidth');
			this.notifyPropertyChange('imageHeight');
		};

		//disabled for now, we can make it better when we have time
		//this.animateMedia(this.get('controller').get('element'));
		this.set('status', 'open');
		this.resetZoom();

		$(window).on('resize', onResize);
		this.set('onResize', onResize);

		this._super();
	},

	willDestroyElement: function (): void {
		$(window).off('resize', this.get('onResize'));

		this._super();
	}
});
