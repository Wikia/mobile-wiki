/// <reference path="../app.ts" />
/// <reference path="../mixins/VisibleMixin.ts" />
/// <reference path="../../baseline/Wikia.d.ts" />
/// <reference path="../../wikia/modules/Thumbnailer.ts" />
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

	computedHeight: function () {
		var imageWidth = this.get('width'),
			pageWidth = $('.article-content').width();

		if (pageWidth < imageWidth) {
			return Math.round(this.get('imgWidth') * (~~this.get('height') / imageWidth));
		}

		return this.get('height');
	}.property('width', 'height'),

	media: function () {
		return Wikia.article.article.media[this.get('ref')];
	}.property('ref'),

	url: function (): string {
		var thumbnailer = Wikia.Modules.Thumbnailer,
			url = this.get('media').url;

		if (!thumbnailer.isThumbUrl(url)) {
			url = thumbnailer.getThumbURL(url, 'nocrop', $('.article-content').width(), '0');
		}

		return url;
	}.property('media'),

	caption: function (): string {
		return this.get('media').caption;
	}.property('media'),

	actions: {
		onVisible: function (): void {
			this.load();
		}
	},

	update: function (src: string): void {
		this.setProperties({
			imageUrl: src,
			visible: true
		});
	},

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
