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
	attributeBindings: ['style'],

	width: null,
	height: null,
	ref: null,
	imageUrl: null,
	visible: Em.computed.notEmpty('imageUrl'),

	computedHeight: function () {
		var imageWidth = this.get('width'),
			pageWidth = $('.article-content').width();

		if (pageWidth < imageWidth) {
			return Math.round(this.get('imgWidth') * (~~this.get('height') / imageWidth));
		}

		return this.get('height');
	}.property('width', 'height'),

	style: function () {
		return "height:%@px;".fmt(this.get('computedHeight'));
	}.property('computedHeight'),

	url: function (): string {
		var thumbnailer = Wikia.Modules.Thumbnailer,
			url = Wikia.article.article.media[this.get('ref')].url;

		if (!thumbnailer.isThumbUrl(url)) {
			url = thumbnailer.getThumbURL(url, 'nocrop', $('.article-content').width(), '0');
		}

		return url;
	}.property('ref'),

	actions: {
		onVisible: function (): void {
			this.load();
		}
	},

	load: function(): void {
		var image = new Image();

		image.src = this.get('url');

		//don't do any animation if image is already loaded
		if (image.complete) {
			this.set('imageUrl', image.src);
		} else {
			image.addEventListener('load', () => {
				this.set('imageUrl', image.src);
			});
		}
	}
});
