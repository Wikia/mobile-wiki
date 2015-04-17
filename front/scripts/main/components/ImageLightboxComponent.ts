/// <reference path="../app.ts" />
/// <reference path="../mixins/LoadingSpinnerMixin.ts" />
'use strict';

App.ImageLightboxComponent = Em.Component.extend(App.LoadingSpinnerMixin, {
	classNames: ['image-lightbox'],

	didInsertElement: function (): void {
		this.showLoader();
		console.log("img.current: ", this.$().find('img.current'))
		this.load();
	},

	/**
	 * load an image and run update function when it is loaded
	 */
	load: function(): void {
		var currentMedia = this.get('controller.currentMedia');
		var url = currentMedia.url,
			image: HTMLImageElement;
		if (url) {
			image = new Image();
			image.src = url;
			if (image.complete) {
				this.update(image.src);
			} else {
				image.addEventListener('load', () => {
					this.update(image.src);
				});
			}
		}
	},

	/**
	 * updates img with its src and sets media component to visible state
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
