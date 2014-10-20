/// <reference path="../app.ts" />
/// <reference path="../../baseline/Wikia.d.ts" />
/// <reference path="../../wikia/modules/Thumbnailer.ts" />
/// <reference path="../mixins/VisibleMixin.ts" />
/// <reference path="../models/MediaModel.ts" />
'use strict';

App.MediaComponent = Em.Component.extend(App.VisibleMixin, {
	tagName: 'figure',
	layoutName: 'components/media',
	classNames: ['media-component'],

	width: null,
	height: null,
	ref: null,
	emptyGif: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAQAIBRAA7',
	visible: false,
	media: null,
	thumbnailer: Wikia.Modules.Thumbnailer,

	/**
	 * @desc content width used to load smaller thumbnails
	 */
	contentWidth: function (): number {
		return $('.article-content').width();
	}.property(),

	/**
	 * @desc if image is not thumbnail, returns url to thumbnail with width set to contentWidth
	 *
	 * @param {String} url
	 * @param {String} mode
	 * @param {Number} width
	 * @param {Number} height
	 *
	 * @return {String}
	 */
	getThumbURL: function (
		url: string,
		mode: string,
		width: number,
		height: number
		): string {
		if (!this.thumbnailer.isThumbnailerUrl(url)) {
			url = this.thumbnailer.getThumbURL(url, mode, width, height);
		}

		return url;
	},

	/**
	 * @desc caption for current media
	 */
	caption: function (key: string, value?: string): string {
		if (value) {
			return value;
		} else {
			var media = this.get('media');

			if (media && typeof media.caption === 'string') {
				return media.caption.htmlSafe();
			}
		}
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
		} else if (media.type === 'video'){
			return App.VideoMediaComponent.create();
		} else {
			return App.ImageMediaComponent.create();
		}
	}
});
