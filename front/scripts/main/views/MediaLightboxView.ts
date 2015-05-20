/// <reference path="./LightboxView.ts" />
/// <reference path="../mixins/LightboxMixin.ts" />
/// <reference path="../mixins/ThirdsClickMixin.ts" />
/// <reference path="../../../../typings/hammerjs/hammerjs" />
'use strict';

interface Window {
	scrollY: number;
}

App.MediaLightboxView = App.LightboxView.extend(App.LightboxMixin, App.ThirdsClickMixin, {
	classNames: ['media-lightbox'],
	videoPlayer: null,

	isGallery: Em.computed.alias('controller.isGallery'),

	rightClickHandler: function(): void {
		this.nextMedia();
	},
	leftClickHandler: function(): void {
		this.prevMedia();
	},
	centerClickHandler: function(): void {
		this.send('toggleUI');
	},

	/**
	 * @desc Checks if a currently displayed media is of a given type
	 * @param {string} type e.g, image / video
	 * @returns {boolean}
	 */
	isCurrentMediaType (type: string): boolean {
		return this.get('controller').get('currentMedia').type === type;
	},

	nextMedia: function (): void {
		this.get('controller').incrementProperty('currentGalleryRef');

		M.track({
			action: M.trackActions.paginate,
			category: 'lightbox',
			label: 'next'
		});
	},

	prevMedia: function (): void {
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
			isGallery = this.get('isGallery');

		if ((isImage || isVideo) && isGallery) {
			this.callClickHandler(event, false);
		} else {
			this._super(event);
		}
	},

	gestures: {
		swipeLeft: function (): void {
			if (this.get('isGallery')) {
				this.nextMedia();
			}
		},

		swipeRight: function (): void {
			if (this.get('isGallery')) {
				this.prevMedia();
			}
		}
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
