/// <reference path="../app.ts" />
/// <reference path="./MediaComponent.ts" />
'use strict';

App.ImageMediaComponent = App.MediaComponent.extend({
	classNames: ['article-image'],
	targetObject: Em.computed.alias('parentView'),
	init: function () {

		this._super();
	},

	/**
	 * used to set proper height to img tag before it loads
	 * so we have less content jumping around due to lazy loading images
	 * @return number
	 */
	computedHeight: function (): number {
		var pageWidth = this.get('contentWidth'),
			imageWidth = this.getWithDefault('width', pageWidth);

		if (pageWidth < imageWidth) {
			return Math.round(this.get('imgWidth') * (~~this.get('height') / imageWidth));
		}

		return this.get('height');
	}.property('width', 'height'),

	url: function (): string {
		return this.thumbUrl(this.get('media').url, this.get('contentWidth'));
	}.property('isGallery', 'media'),

	/**
	 * load an image and run update function when it is loaded
	 */
	load: function(): void {
		var image = new Image();

		image.src = this.get('url');

		if (image.complete) {
			this.update(image.src);
		} else {
			image.addEventListener('load', () => {
				this.update(image.src);
			});
		}
	},

	actions: {
		click: function () {
			console.log('image');
			this.sendAction();
		}
	},

	mouseDown: function () {
		console.log('image');
		this.sendAction();
	}

});
