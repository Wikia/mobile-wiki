/// <reference path="./LightboxView.ts" />
'use strict';

App.MediaLightboxView = App.LightboxView.extend({
	classNames: ['media-lightbox'],

	//opening, open
	//before didInsertElement the lightbox is opening
	status: 'opening',

	keyDown: function (event: JQueryEventObject) {
		if (event.keyCode === 39) {
			//handle right arrow
			this.get('controller').incrementProperty('currentGalleryRef')
		} else if (event.keyCode === 37) {
			//handle left arrow
			this.get('controller').decrementProperty('currentGalleryRef')
		}

		this._super(event);
	},

	didInsertElement: function () {
		//disabled for now, we can make it better when we have time
		//this.animateMedia(this.get('controller').get('element'));
		this.set('status', 'open');
		this.get('parentView').send('setUnscrollable');

		this._super();
	},

	animateMedia: function (image?: HTMLElement) {
		if (image) {
			var $image = $(image).find('img'),
				offset = $image.offset(),
				$imageCopy = $($image).clone(),
				width = $image.width(),
				deviceWidth = document.body.offsetWidth;

			//initial style, mimick the image that is in page
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
				top: ((document.body.offsetHeight - ($image.height() * (deviceWidth / width))) / 2) + 'px',
				left: 0
			}).one('webkitTransitionEnd, transitionend', function () {
				$imageCopy.remove();
			});
		}
	},

	willDestroyElement: function () {
		this.get('parentView').send('setScrollable');
		this.get('controller').reset();

		this._super();
	}
});

