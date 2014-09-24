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
	emptyGif: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAQAIBRAA7',
	visible: false,
	media: null,

	/**
	 * @desc content width used to load smaller thumbnails
	 */
	contentWidth: function (): number {
		return $('.article-content').width();
	}.property(),


	/**
	 * @desc url for given media
	 * if image is not thumbnail, returns url to thumbnail with width set to contentWidth
	 *
	 */
	thumbUrl: function (url: string, width: number, height: number = 0, type: string = 'nocrop'): string {
		var thumbnailer = Wikia.Modules.Thumbnailer,
			url = url;

		if (!thumbnailer.isThumbUrl(url)) {
			url = thumbnailer.getThumbURL(url, type, width, height);
		}

		return url;
	},

	/**
	 * @desc caption for current media
	 */
	caption: function (): string {
		var caption = this.get('media').caption;

		if (typeof caption === 'string') {
			return caption.htmlSafe();
		}

		return caption;
	}.property('media'),

	actions: {
		onVisible: function (): void {
			this.load();
		}
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
