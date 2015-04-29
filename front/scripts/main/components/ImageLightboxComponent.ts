/// <reference path="../app.ts" />
/// <reference path="../mixins/LoadingSpinnerMixin.ts" />
/// <reference path="../mixins/HammerMixin.ts" />
'use strict';

App.ImageLightboxComponent = Em.Component.extend(App.LoadingSpinnerMixin, App.HammerMixin, {
	classNames: ['lightbox-content-inner'],

	didInsertElement: function (): void {
		var currentMedia = this.get('controller.currentMedia');
		if (currentMedia && currentMedia.url) {
			this.showLoader();
			this.load(currentMedia.url);
		}
	},

	/**
	 * @desc load an image and run update function when it is loaded
	 *
	 * @param url string - url of current image
	 */
	load: function (url: string): void {
		var image: HTMLImageElement = new Image();
		image.src = url;
		if (image.complete) {
			this.update(image.src);
		} else {
			image.addEventListener('load', () => {
				this.update(image.src);
			});
		}
	},

	/**
	 * @desc updates img with its src and sets media component to visible state
	 *
	 * @param src string - src for image
	 */
	update: function (src: string): void {
		this.setProperties({
			imageSrc: src,
			visible: true
		});
		this.hideLoader();
	}
});
