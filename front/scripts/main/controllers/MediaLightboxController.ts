/// <reference path="./LightboxController.ts" />
/// <reference path="../models/MediaModel.ts" />
'use strict';

App.MediaLightboxController = App.LightboxController.extend({
	needs: 'article',

	file: Em.computed.alias(
		'controllers.article.file'
	),
	data: {
		mediaRef: null,
		galleryRef: null,
		target: null
	},
	//standard place where other components can set data for media lightbox
	currentMediaRef: Em.computed.alias(
		'data.mediaRef'
	),
	//element on a page that will be animated
	element: Em.computed.alias(
		'data.target'
	),
	model: Em.computed.oneWay(
		'controllers.article.model.media'
	),

	init: function (): void {
		this.matchQueryString();

		this._super();
	},

	/**
	 * This function checks if file=* matches any files on a page
	 */
	matchQueryString: function (): void {
		var file = this.get('file');

		function findMediaInGallery (key: number): Function {
			return function (galleryMedia: any, galleryKey: number): boolean {
				if (galleryMedia.title === file) {
					this.setProperties({
						currentMediaRef: key,
						currentGalleryRef: galleryKey
					});

					return true;
				} else {
					return false;
				}
			};
		}

		function findMedia (media: any, key: number): boolean {
			if (Em.isArray(media)) {
				return media.some(findMediaInGallery(key), this);
			} else if (media.title === file) {
				this.set('currentMediaRef', key);

				return true;
			}

			return false;
		}

		if (!Em.isEmpty(file)) {
			this.get('model').get('media').some(findMedia, this);
		}
	},

	currentGalleryRef: Em.computed('data.galleryRef', function (key: string, value?: number): number {
		var galleryLength: number;

		if (arguments.length > 1) {
			galleryLength = this.get('galleryLength') - 1;

			if (value < 0) {
				return galleryLength;
			} else if (value > galleryLength) {
				return 0;
			}

			return value;
		} else {
			return this.get('data.galleryRef') || 0
		}
	}),

	/**
	 * check if current displayed media is a gallery
	 *
	 * @return boolean
	 */
	isGallery: Em.computed('current', function (): boolean {
		return Em.isArray(this.get('current'));
	}),

	/**
	 * gets current media from model
	 *
	 * @return object
	 */
	current: Em.computed('model', 'currentMediaRef', function (): ArticleMedia {
		return this.get('model').find(this.get('currentMediaRef'));
	}),

	/**
	 * gets current media or current media from gallery
	 *
	 * @return object
	 */
	currentMedia: Em.computed('current', 'isGallery', 'currentGalleryRef', function (): ArticleMedia {
		var current = this.get('current');

		if (this.get('isGallery')) {
			return current[this.get('currentGalleryRef')];
		} else {
			return current;
		}
	}),

	galleryLength: Em.computed('isGallery', 'current', function	(): number {
		if (this.get('isGallery')) {
			return this.get('current').length;
		} else {
			return -1;
		}
	}),

	/**
	 * observes curentMedia and updates file property
	 * that is an alias from article file and is a queryParam
	 */
	currentMediaObserver: Em.observer('currentMedia', function (): void {
		var currentMedia = this.get('currentMedia');

		if (!currentMedia) {
			this.set('file', null);
			return;
		}

		this.set('file', currentMedia.title);
	}).on('init'),

	/**
	 * closes lightbox when file queryParam is not set
	 * otherwise tries to open image lightbox with appropriate image
	 */
	fileObserver: Em.observer('file', function (): void {
		if (this.get('file') == null) {
			this.send('closeLightbox');
		} else {
			this.matchQueryString();
		}
	}),

	/**
	 * returns footer for currentMedia
	 *
	 * @return string
	 */
	footer: Em.computed('currentMedia', function (): string {
		var currentMedia = this.get('currentMedia');

		if (currentMedia) {
			var caption = currentMedia.caption;

			return caption && caption.htmlSafe();
		} else {
			return '';
		}
	}),

	/**
	 * returns header for gallery
	 *
	 * @return string
	 */
	galleryHeader: Em.computed('galleryLength', 'currentGalleryRef', function (): string {
		return (this.get('currentGalleryRef') + 1) + ' / ' + this.get('galleryLength');
	}),

	/**
	 * returns header for currentMedia if it is a gallery
	 *
	 * @return string
	 */
	header: Em.computed('isGallery', 'galleryHeader', function (): string {
		if (this.get('isGallery')) {
			return this.get('galleryHeader');
		}
		return '';
	}),

	/**
	 * sets all properties to their null state
	 */
	reset: function (): void {
		this.setProperties({
			data: {
				mediaRef: null,
				galleryRef: null,
				target: null
			},
			file: null
		});

		this._super();
	}
});
