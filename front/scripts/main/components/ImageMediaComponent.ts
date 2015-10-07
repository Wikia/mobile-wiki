/// <reference path="../app.ts" />
/// <reference path="./MediaComponent.ts" />
/// <reference path="../mixins/ArticleContentMixin.ts" />
/// <reference path="../mixins/ViewportMixin.ts" />
'use strict';

App.ImageMediaComponent = App.MediaComponent.extend(App.ArticleContentMixin, App.ViewportMixin, {
	smallImageSize: {
		height: 64,
		width: 64
	},
	classNames: ['article-image'],
	classNameBindings: ['hasCaption', 'visible', 'isSmall', 'isIcon'],
	layoutName: 'components/image-media',

	imageSrc: Em.computed.oneWay('emptyGif'),

	caption: Em.computed('media.caption', 'isIcon', function (): string|boolean {
		var caption = this.get('media.caption');
		return this.get('isIcon') ? false : caption;
	}),

	link: Em.computed.alias('media.link'),

	isSmall: Em.computed('media.width', 'media.height', function (): boolean {
		var imageWidth = this.get('media.width'),
			imageHeight = this.get('media.height');

		return !!imageWidth && imageWidth < this.smallImageSize.width || imageHeight < this.smallImageSize.height;
	}),

	isIcon: Em.computed.equal('media.context', 'icon'),

	/**
	 * used to set proper height to img tag before it loads
	 * so we have less content jumping around due to lazy loading images
	 * @return number
	 */
	computedHeight: Em.computed('width', 'height', 'articleContent.width', function (): number {
		var pageWidth = this.get('articleContent.width'),
			imageWidth = this.get('width') || pageWidth,
			imageHeight = this.get('height');

		if (!Em.isEmpty(imageHeight) && pageWidth < imageWidth) {
			return Math.floor(pageWidth * (imageHeight / imageWidth));
		}

		return imageHeight;
	}),

	/**
	 * @desc return the thumbURL for media.
	 * If media is an icon, use the limited width.
	 */
	url: Em.computed({
		get(): string {
				var media: ArticleMedia = this.get('media'),
					mode: string = Mercury.Modules.Thumbnailer.mode.thumbnailDown,
					width: number = this.get('articleContent.width');

				if (!media) {
					return this.get('imageSrc');
				}

				if (media.context === 'icon') {
					mode = Mercury.Modules.Thumbnailer.mode.scaleToWidth;
					width = this.get('iconWidth');
				}

				return this.getThumbURL(media.url, {
					mode: mode,
					height: this.get('computedHeight'),
					width: width
				});

				//if it got here, that means that we don't have an url for this media
				//this might happen for example for read more section images
			},
			set(key: string, value: string): string {
				return this.getThumbURL(value, {
					mode: Mercury.Modules.Thumbnailer.mode.topCrop,
					height: this.get('computedHeight'),
					width: this.get('articleContent.width')
				});
			}
	}),

	/**
	 * @desc style used on img tag to set height of it before we load an image
	 * so when image loads, browser don't have to resize it
	 */
	style: Em.computed('computedHeight', 'visible', function (): Em.Handlebars.SafeString {
		var computedHeight = this.get('computedHeight'),
			visible = this.get('visible'),
			style = (visible || Em.isEmpty(computedHeight)) ?
				'' :
				`height:${computedHeight}px;`;

		return new Em.Handlebars.SafeString(style);
	}),

	/**
	 * load an image and run update function when it is loaded
	 */
	load(): void {
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
	update(src: string): void {
		this.setProperties({
			imageSrc: src,
			visible: true
		});
	}
});
