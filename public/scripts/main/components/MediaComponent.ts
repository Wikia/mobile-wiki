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

	media: function (): media {
		return App.Media.find(this.get('ref'));
	}.property('ref'),

	isGallery: function () {
		return Em.isArray(this.get('media'));
	}.property('model'),

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
	computedHeight: function (): any {
		var imageWidth = this.get('width'),
			pageWidth = this.get('contentWidth');

		if (this.get('isGallery')) {
			return false;
		} else {
			if (pageWidth < imageWidth) {
				return Math.round(this.get('imgWidth') * (~~this.get('height') / imageWidth));
			}
		}

		return this.get('height');
	}.property('width', 'height'),

	/**
	 * url for given media
	 * if image is not thumbnail, returns url to thumbnail with width set to contentWidth
	 *
	 * @return string
	 */
	thumbUrl: function (url: string, width: number, height: number = 0): string {
		var thumbnailer = Wikia.Modules.Thumbnailer,
			url = url;

		if (!thumbnailer.isThumbUrl(url)) {
			url = thumbnailer.getThumbURL(url, 'nocrop', width, height);
		}

		return url;
	},

	urls: function (): any {
		var urls = [];

		if (this.get('isGallery')) {
			this.get('media').forEach((media) => {
				//urls.push(this.thumbUrl(media.url, 195, 195));
				urls.push(this.get('imageUrl'));
			})
		} else {
			return this.thumbUrl(this.get('media').url, this.get('contentWidth'));
		}

		return urls;
	}.property('isGallery', 'media'),

	url: Em.computed.alias('urls'),

	/**
	 * caption for current media
	 */
	caption: function (): string {
		return this.get('media').caption;
	}.property('media'),

	click: function () {
		console.log(this)
	},

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
		if (this.get('isGallery')) {
			this.$().on('scroll', function () {
				console.log(this)
			})
		} else {
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
	}
});

App.ImageMediaComponent = App.MediaComponent.extend({
	classNames: ['article-image'],
	targetObject: Em.computed.alias('parentView'),
	init: function () {

		this._super();
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

App.GalleryMediaComponent = App.MediaComponent.extend({
	classNames: ['article-gallery'],
	layoutName: 'components/gallery-media'
});

App.MediaComponent.reopenClass({
	newFromRef: function (ref: number) {
		var media = App.Media.find(ref);

		if (Em.isArray(media)) {
			return App.GalleryMediaComponent.create();
		} else {
			return App.ImageMediaComponent.create();
		}
	}
});
