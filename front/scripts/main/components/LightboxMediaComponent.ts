/// <reference path="../models/MediaModel.ts" />
'use strict';

App.LightboxMediaComponent = Em.Component.extend(App.ThirdsClickMixin, {
	classNames: ['lightbox-media', 'lightbox-content-inner'],
	// This is needed for keyDown event to work
	attributeBindings: ['tabindex'],
	tabindex: 0,
	videoPlayer: null,

	/**
	 * @desc gets current media from model
	 *
	 * @return object
	 */
	current: Em.computed('model.media', 'model.mediaRef', function (): ArticleMedia {
		var mediaModel: typeof App.MediaModel = this.get('model.media');
		if (mediaModel instanceof App.MediaModel) {
			return mediaModel.find(this.get('model.mediaRef'));
		} else {
			Em.Logger.error('Media model is not an instance of App.MediaModel');
			return null;
		}
	}),

	/**
	 * @desc gets current media or current media from gallery
	 *
	 * @return object
	 */
	currentMedia: Em.computed('current', 'isGallery', 'currentGalleryRef', function (): ArticleMedia {
		var current = this.get('current');
		return this.get('isGallery') ? current[this.get('currentGalleryRef')] : current;
	}),

	currentGalleryRef: Em.computed('model.galleryRef', {
		get(): number {
			return this.get('model.galleryRef') || 0;
		},
		set(key: string, value: number): number {
			var galleryLength = this.get('galleryLength') - 1;

			if (value < 0) {
				return galleryLength;
			} else if (value > galleryLength) {
				return 0;
			}

			return value;
		}
	}),

	galleryLength: Em.computed('isGallery', 'current', function (): number {
		return this.get('isGallery') ? this.get('current').length : -1;
	}),

	/**
	 * @desc checks if current displayed media is a gallery
	 *
	 * @return boolean
	 */
	isGallery: Em.computed('current', function (): boolean {
		return Em.isArray(this.get('current'));
	}),

	/**
	 * @desc checks if current media is a video or image
	 * and which lightbox component to render
	 *
	 * @return string
	 */
	lightboxComponent: Em.computed('currentMedia', function (): string {
		var currentMedia: ArticleMedia = this.get('currentMedia');
		return currentMedia && currentMedia.url && currentMedia.type ? 'lightbox-' + currentMedia.type : null;
	}),

	modelObserver: Em.observer('model', 'currentMedia', function (): void {
		this.updateHeader();
		this.updateFooter();

		this.set('queryParamFile', M.String.sanitize(this.get('currentMedia.title')));
	}).on('didInsertElement'),

	didInsertElement: function (): void {
		// This is needed for keyDown event to work
		this.$().focus();
	},

	click: function (event: MouseEvent): void {
		var isImage = this.isCurrentMediaType('image'),
			isVideo = this.isCurrentMediaType('video'),
			isGallery = this.get('isGallery');

		if ((isImage || isVideo) && isGallery) {
			this.callClickHandler(event, true);
		} else {
			this._super(event);
		}
	},

	keyDown: function (event: JQueryEventObject): void {
		if (this.get('isGallery')) {
			if (event.keyCode === 39) {
				//handle right arrow
				this.nextMedia();
			} else if (event.keyCode === 37) {
				//handle left arrow
				this.prevMedia();
			}
		}

		this._super(event);
	},

	gestures: {
		swipeLeft: function (): void {
			if (this.get('isGallery')) {
				this.nextMedia();
			}
		},

		swipeRight: function (): void {
			if (this.get('isGallery')) {
				this.prevMedia();
			}
		}
	},

	rightClickHandler: function(): boolean {
		this.nextMedia();
		return true;
	},
	leftClickHandler: function(): boolean {
		this.prevMedia();
		return true;
	},
	centerClickHandler: function(): boolean {
		// Bubble up
		return false;
	},

	/**
	 * @desc Checks if a currently displayed media is of a given type
	 * @param {string} type e.g, image / video
	 * @returns {boolean}
	 */
	isCurrentMediaType (type: string): boolean {
		return this.get('currentMedia.type') === type;
	},

	nextMedia: function (): void {
		this.incrementProperty('currentGalleryRef');

		M.track({
			action: M.trackActions.paginate,
			category: 'lightbox',
			label: 'next'
		});
	},

	prevMedia: function (): void {
		this.decrementProperty('currentGalleryRef');

		M.track({
			action: M.trackActions.paginate,
			category: 'lightbox',
			label: 'previous'
		});
	},

	updateHeader: function (): void {
		var header: string = null;

		if (this.get('isGallery')) {
			header = (this.get('currentGalleryRef') + 1) + ' / ' + this.get('galleryLength');
		}

		this.sendAction('setHeader', header);
	},

	updateFooter: function (): void {
		var currentMedia: ArticleMedia = this.get('currentMedia'),
			footer: typeof Handlebars.SafeString = null;

		if (currentMedia && currentMedia.caption) {
			footer = currentMedia.caption.htmlSafe();
		}

		this.sendAction('setFooter', footer);
	}
});
