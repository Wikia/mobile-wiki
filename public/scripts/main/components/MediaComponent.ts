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
			//this.load();
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
	}
});

App.MediaComponent.reopenClass({
	newFromMedia: function (media: ArticleMedia): typeof App.MediaComponent {
		if (Em.isArray(media)) {
			return App.GalleryMediaComponent.create();
		} else {
			return App.ImageMediaComponent.create();
		}
	}
});
