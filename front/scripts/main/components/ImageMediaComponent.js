App.ImageMediaComponent = App.MediaComponent.extend(
	App.ArticleContentMixin,
	App.ViewportMixin,
	{
		smallImageSize: {
			height: 64,
			width: 64,
		},
		classNames: ['article-image'],
		classNameBindings: ['hasCaption', 'visible', 'isSmall', 'isIcon'],
		layoutName: 'components/image-media',

		imageSrc: Em.computed.oneWay('emptyGif'),

		caption: Em.computed('media.caption', 'isIcon', function () {
			return this.get('isIcon') ? false : this.get('media.caption');
		}),

		link: Em.computed.alias('media.link'),

		isSmall: Em.computed('media.width', 'media.height', function () {
			const imageWidth = this.get('media.width'),
				imageHeight = this.get('media.height');

			return (
				Boolean(imageWidth) &&
				imageWidth < this.smallImageSize.width ||
				imageHeight < this.smallImageSize.height
			);
		}),

		isIcon: Em.computed.equal('media.context', 'icon'),

		/**
		 * used to set proper height to img tag before it loads
		 * so we have less content jumping around due to lazy loading images
		 */
		computedHeight: Em.computed('width', 'height', 'articleContent.width', function () {
			const pageWidth = this.get('articleContent.width'),
				imageWidth = this.get('width') || pageWidth,
				imageHeight = this.get('height');

			if (!Em.isEmpty(imageHeight) && pageWidth < imageWidth) {
				return Math.floor(pageWidth * (imageHeight / imageWidth));
			}

			return imageHeight;
		}),

		/**
		 * return the thumbURL for media.
		 * If media is an icon, use the limited width.
		 */
		url: Em.computed({
			get() {
				const media = this.get('media');

				let mode = Mercury.Modules.Thumbnailer.mode.thumbnailDown,
					width = this.get('articleContent.width');

				if (!media) {
					return this.get('imageSrc');
				}

				if (media.context === 'icon') {
					mode = Mercury.Modules.Thumbnailer.mode.scaleToWidth;
					width = this.get('iconWidth');
				}

				return this.getThumbURL(media.url, {
					mode,
					height: this.get('computedHeight'),
					width
				});

				// if it got here, that means that we don't have an url for this media
				// this might happen for example for read more section images
			},
			set(key, value) {
				return this.getThumbURL(value, {
					mode: Mercury.Modules.Thumbnailer.mode.topCrop,
					height: this.get('computedHeight'),
					width: this.get('articleContent.width')
				});
			}
		}),

		/**
		 * style used on img tag to set height of it before we load an image
		 * so when image loads, browser don't have to resize it
		 */
		style: Em.computed('computedHeight', 'visible', function () {
			const computedHeight = this.get('computedHeight'),
				visible = this.get('visible'),
				style = (visible || Em.isEmpty(computedHeight)) ?
					'' :
					`height:${computedHeight}px;`;

			return new Em.Handlebars.SafeString(style);
		}),

		/**
		 * load an image and run update function when it is loaded
		 *
		 * @returns {void}
		 */
		load() {
			const url = this.get('url');

			if (url) {
				let image;

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
		 * @param {string} src source for image
		 * @returns {void}
		 */
		update(src) {
			this.setProperties({
				imageSrc: src,
				visible: true
			});
		},
	}
);
