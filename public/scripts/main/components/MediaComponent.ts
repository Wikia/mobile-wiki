/// <reference path="../app.ts" />
/// <reference path="../../baseline/mercury.d.ts" />
/// <reference path="../../mercury/modules/Thumbnailer.ts" />
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
	thumbnailer: Mercury.Modules.Thumbnailer,
	limitHeight: false,

	//thumb widths
	thumbSize: {
		small: 340,
		medium: 660,
		large: 900
	},

	/**
	 * @desc content width used to load smaller thumbnails
	 */
	contentWidth: function (): number {
		return $('.article-content').width();
	}.property(),

	normalizeThumbWidth: function (width: number): number {
		if (width <= this.thumbSize.small) {
			return this.thumbSize.small;
		} else if (width <= this.thumbSize.medium) {
			return this.thumbSize.medium;
		}

		return this.thumbSize.medium;
	},

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

		if (mode === Mercury.Modules.Thumbnailer.mode.thumbnailDown) {
			width = this.normalizeThumbWidth(width);
		}

		if (!this.limitHeight) {
			height = width;
		}

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
		},

		clickLinkedImage: function (): boolean {
			M.track({
				action: M.trackActions.click,
				category: 'linkedimage'
			});
			return true;
		}
	}
});

App.MediaComponent.reopenClass({
	newFromMedia: function (media: ArticleMedia): typeof App.MediaComponent {
		if (Em.isArray(media)) {
			var isLinked: boolean = false;
			for (var i in media) {
				if (typeof media[i] === 'object' && media[i].link) {
					isLinked = true;
				}
			}
			if (isLinked) {
				return App.LinkedGalleryMediaComponent.create();
			} else {
				return App.GalleryMediaComponent.create();
			}
		} else if (media.type === 'video'){
			return App.VideoMediaComponent.create();
		} else {
			return App.ImageMediaComponent.create();
		}
	}
});
