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

	isSmall: Em.computed('width', 'height', function(): boolean {
		var imageWidth = this.get('width'),
			imageHeight = this.get('height');

		return !!imageWidth && imageWidth < this.smallImageSize.width || imageHeight < this.smallImageSize.height;

	}),

	/**
	 * used to set proper height to img tag before it loads
	 * so we have less content jumping around due to lazy loading images
	 * @return number
	 */
	computedHeight: Em.computed('width', 'height', 'articleContent.width', function (): number {
		var pageWidth = this.get('articleContent.width'),
			imageWidth = this.get('width') || pageWidth,
			imageHeight = this.get('height');

		if (pageWidth < imageWidth) {
			return ~~(pageWidth * (imageHeight / imageWidth));
		}

		return imageHeight;
	}),

	/**
	 * @desc return the thumbURL for media.
	 * If media is an icon inside the infobox, width 
	 * was already set.
	 */
	url: Em.computed({
		get(): string {
			var media: ArticleMedia = this.get('media'),
				icon: boolean,
				mode: string,
				width: number;

			if (media) {
				icon = this.get('isInfoboxIcon');
				if (icon) {
					mode =  Mercury.Modules.Thumbnailer.mode.scaleToWidth;
					width = this.get('width');
				} else {
					mode = Mercury.Modules.Thumbnailer.mode.thumbnailDown;
					width = this.get('articleContent.width');
				}

				return this.getThumbURL(media.url, {
					mode: mode,
					height: this.get('computedHeight'),
					width: width
				});
			}

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
	style: Em.computed('computedHeight', 'visible', function (): typeof Handlebars.SafeString {
		return (this.get('visible') ?
			'' :
			`height:${this.get('computedHeight')}px;`).htmlSafe();
	}),

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
