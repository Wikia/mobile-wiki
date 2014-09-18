/// <reference path="../app.ts" />
/// <reference path="../../baseline/Wikia.d.ts" />
/// <reference path="../../wikia/modules/Thumbnailer.ts" />
/// <reference path="../mixins/VisibleMixin.ts" />
/// <reference path="../models/MediaModel.ts" />
'use strict';

App.MediaComponent = Em.Component.extend(App.VisibleMixin, {
	tagName: 'figure',
	layoutName: 'components/media',
	classNames: ['article-media'],
	classNameBindings: ['visible'],

	width: null,
	height: null,
	ref: null,
	imageUrl: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAQAIBRAA7',
	visible: false,
	media: null,

	/**
	 * content width used to load smaller thumbnails
	 * @return number
	 */
	contentWidth: function (): number {
		return $('.article-content').width();
	}.property(),

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

	/**
	 * url for given media
	 * if image is not thumbnail, returns url to thumbnail with width set to contentWidth
	 *
	 * @return string
	 */
	url: function (): string {
		var thumbnailer = Wikia.Modules.Thumbnailer,
			url = this.get('media').url;

		if (!thumbnailer.isThumbUrl(url)) {
			url = thumbnailer.getThumbURL(url, 'nocrop', this.get('contentWidth'), '0');
		}

		return url;
	}.property('media'),

	/**
	 * caption for current media
	 */
	caption: function (): string {
		return this.get('media').caption;
	}.property('media'),

	actions: {
		onVisible: function (): void {
			this.load();
		}
	},

	/**
	 * updates img with its src and sets media component to visible state
	 *
	 * @param src string - src for image
	 */
	update: function (src: string): void {
		this.setProperties({
			imageUrl: src,
			visible: true
		});
	},

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
	}
});
