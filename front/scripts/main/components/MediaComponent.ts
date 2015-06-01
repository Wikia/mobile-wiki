/// <reference path="../app.ts" />
/// <reference path="../../baseline/mercury.d.ts" />
/// <reference path="../../mercury/modules/Thumbnailer.ts" />
/// <reference path="../mixins/VisibleMixin.ts" />
/// <reference path="../models/MediaModel.ts" />
'use strict';

App.MediaComponent = Em.Component.extend(App.VisibleMixin, {
	tagName: 'figure',
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

	normalizeThumbWidth: function (width: number): number {
		if (width <= this.thumbSize.small) {
			return this.thumbSize.small;
		} else if (width <= this.thumbSize.medium) {
			return this.thumbSize.medium;
		}

		return this.thumbSize.medium;
	},

	getThumbURL: function (url: string, options: {mode: string; width: number; height?: number; limitHeight?: boolean}): string {
		if (options.mode === Mercury.Modules.Thumbnailer.mode.thumbnailDown) {
			options.width = this.normalizeThumbWidth(options.width);
		}

		if (!this.get('limitHeight') && !options.limitHeight) {
			options.height = options.width;
		}

		url = this.thumbnailer.getThumbURL(url, options);

		return url;
	},

	isInfoboxIcon: Em.computed(function(): boolean {
		var media: ArticleMedia = this.get('media'),
			insideInfobox = $('.portable-infobox').find(this.element).length;


		console.log("isInfoboxIcon");
		if (!media.context && insideInfobox > 0) {
			this.set('width', 50);
			this.set('height', 20);
			return true;
		}
		return false;
	}),

	/**
	 * @desc caption for current media
	 */
	caption: Em.computed('media', {
		get(): string {
			var media = this.get('media');

			if (media && typeof media.caption === 'string') {
				return media.caption;
			}
		},
		set(key: string, value: string): string {
			return value;
		}
	}),

	actions: {
		onVisible: function (): void {
			this.load();
		},

		clickLinkedImage: function (): void {
			M.track({
				action: M.trackActions.click,
				category: 'linked-image'
			});
		}
	}
});

App.MediaComponent.reopenClass({
	newFromMedia: function (media: ArticleMedia): typeof App.MediaComponent {
		if (Em.isArray(media)) {
			if ((<any>media).some((media: ArticleMedia) => !!media.link)) {
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
