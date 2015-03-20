/// <reference path="../app.ts" />
/// <reference path="./MediaComponent.ts" />
/// <reference path="../mixins/ArticleContentMixin.ts" />
'use strict';

App.ImageMediaComponent = App.MediaComponent.extend(App.ArticleContentMixin, {
	smallImageSize: {
		height: 64,
		width: 64
	},
	classNames: ['article-image'],
	classNameBindings: ['hasCaption', 'visible', 'isSmall'],
	layoutName: 'components/image-media',

	imageSrc: Em.computed.oneWay(
		'emptyGif'
	),
	hasCaption: Em.computed.notEmpty('media.caption'),

	link: Em.computed.alias('media.link'),

	isSmall: function(): boolean {
		var imageWidth = this.get('width'),
			imageHeight = this.get('height');

		return !!imageWidth && imageWidth < this.smallImageSize.width || imageHeight < this.smallImageSize.height;

	}.property('width', 'height'),

	/**
	 * used to set proper height to img tag before it loads
	 * so we have less content jumping around due to lazy loading images
	 * @return number
	 */
	computedHeight: function (): number {
		var pageWidth = this.get('articleContent.width'),
			imageWidth = this.get('width') || pageWidth,
			imageHeight = this.get('height');

		if (pageWidth < imageWidth) {
			return ~~(pageWidth * (imageHeight / imageWidth));
		}

		return imageHeight;
	}.property('width', 'height', 'articleContent.width'),

	url: function (key: string, value?: string): string {
		var media: ArticleMedia;
		if (value) {
			return this.getThumbURL(
				value,
				Mercury.Modules.Thumbnailer.mode.topCrop,
				this.get('articleContent.width'),
				this.get('computedHeight')
			);
		} else {
			media = this.get('media');

			if (media) {
				return this.getThumbURL(
					this.get('media').url,
					Mercury.Modules.Thumbnailer.mode.thumbnailDown,
					this.get('articleContent.width'),
					this.get('computedHeight')
				);
			}
		}

		//if it got here, that means that we don't have an url for this media
		//this might happen for example for read more section images
	}.property(),

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
		var url = this.get('url'),
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
	}
});
