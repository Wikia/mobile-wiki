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
	normalizeWidth: true,

	//thumb widths
	thumbSize: {
		small: 340,
		medium: 660,
		large: 900
	},

	//icon width depends on it's real dimensions
	iconHeight: 20,
	iconWidth: Em.computed('media', 'iconHeight', function(): number {
		var media = this.get('media'),
			iconHeight = this.get('iconHeight');

		return Math.floor(iconHeight * media.width / media.height);
	}),

	normalizeThumbWidth: function (width: number): number {
		if (width <= this.thumbSize.small) {
			return this.thumbSize.small;
		} else if (width <= this.thumbSize.medium) {
			return this.thumbSize.medium;
		}

		return this.thumbSize.medium;
	},

	getThumbURL: function (url: string, options: {mode: string; width: number; height?: number}): string {
		if (options.mode === Mercury.Modules.Thumbnailer.mode.thumbnailDown && this.get('normalizeWidth')) {
			options.width = this.normalizeThumbWidth(options.width);
		}

		// Sometimes width is null, so we need to make sure it has a value.
		// I chose 378 because that is the correct size on iPhone 6 Plus
		options.width = options.width || 378;

		// If there is no restriction on height, make the image square.
		// Otherwise, make it 16x9
		if (!this.get('limitHeight')) {
			options.height = options.width;
		} else {
			options.height = (options.width * 9 / 16) | 0;
		}

		url = this.thumbnailer.getThumbURL(url, options);

		// Currently the cache is acting weirdly, uncomment this line to bypass it
		// DO NOT USE IN PROD
		//url += "&replace=true";
		
		return url;
	},

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
		if (media.context === 'infobox') {
			return App.InfoboxImageMediaComponent.create();
		} else if (Em.isArray(media)) {
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
