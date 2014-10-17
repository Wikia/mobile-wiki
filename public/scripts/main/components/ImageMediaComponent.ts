/// <reference path="../app.ts" />
/// <reference path="./MediaComponent.ts" />
'use strict';

App.ImageMediaComponent = App.MediaComponent.extend({
	classNames: ['article-image'],
	classNameBindings: ['visible'],

	imageSrc: Em.computed.oneWay(
		'emptyGif'
	),

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

	url: function (key: string, value?: string): string {
		var media: ArticleMedia;

		if (value) {
			return this.getThumbURL(value, this.get('contentWidth'), this.get('computedHeight'), 'crop');
		} else {
			media = this.get('media');

			if (media) {
				return this.getThumbURL(this.get('media').url, this.get('contentWidth'), this.get('computedHeight'));
			}
		}

		//if it got here, that means that we don't have an url for this media
		//this might happen for example for read more section images
	}.property('media', 'contentWidth'),

	/**
	 * @desc style used on img tag to set height of it before we load an image
	 * so when image loads, browser don't have to resize it
	 */
	style: function (): string {
		return this.get('visible') ?
			'' :
			'height:%@px;'.fmt(this.get('computedHeight'));
	}.property('computedHeight', 'visible'),

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
	}
});
