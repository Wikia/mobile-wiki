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
		this.animateMedia(this.get('controller').get('element'));
		this.set('status', 'open');
		this.get('parentView').send('setUnscrollable');

		this._super();
	},

	animateMedia: function (image?: HTMLElement) {
		if (image) {
			var $image = $(image).find('img'),
				offset = $image.offset(),
				$imageCopy = $($image).clone();

			//initial style, mimck the image that is in page
			$imageCopy.css({
				top: offset.top - window.scrollY + 'px',
				left: offset.left + 'px',
				width: $image.width() + 'px'
			//for static css properties see _media_lightbox.scss
			}).addClass('animated-media');

			this.$().append($imageCopy);

			//animate to full width and middle of screen
			$imageCopy.css({
				width: document.body.offsetWidth + 'px',
				top: this.$('img')[0].offsetTop + 'px',
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

