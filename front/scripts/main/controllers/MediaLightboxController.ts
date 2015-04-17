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
	 * @desc Checks if file from URL matches with currentMedia.
	 * Handles situation when file is empty and when, 
	 * 'back' button is pressed and other unexpected situations.
	 */
	fileObserver: function (): void {
		var currentMedia = this.get('currentMedia'),
			file = this.get('file');

		if (currentMedia && currentMedia.title !== file) {
			this.send('closeLightbox');
		}
	}.observes('file'),

	/**
	 * @desc checks if file=* matches any files on a page
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

	currentGalleryRef: function (key: string, value?: number): number {
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
			return this.get('data.galleryRef') || 0;
		}
	}.property('data.galleryRef'),

	/**
	 * @desc checks if current displayed media is a gallery
	 *
	 * @return boolean
	 */
	isGallery: function (): boolean {
		return Em.isArray(this.get('current'));
	}.property('current'),

	/**
	 * @desc checks if current media is a video or image
	 * and which lightbox component to render
	 *
	 * @return string
	 */
	lightboxComponent: function (): string {
		var currentMedia = this.get('currentMedia');
		if (currentMedia.url) {
			return currentMedia.type + '-lightbox';
		}
		// in case of invalid media assume it was image and display
		// 'Media not found' will be handled by template
		return 'image-lightbox';
	}.property('file'),

	/**
	 * @desc gets current media from model
	 *
	 * @return object
	 */
	current: function (): ArticleMedia {
		return this.get('model').find(this.get('currentMediaRef'));
	}.property('model', 'currentMediaRef'),

	/**
	 * @desc gets current media or current media from gallery
	 *
	 * @return object
	 */
	currentMedia: function (): ArticleMedia {
		var current = this.get('current');

		if (this.get('isGallery')) {
			return current[this.get('currentGalleryRef')];
		} else {
			return current;
		}
	}.property('current', 'isGallery', 'currentGalleryRef'),

	galleryLength: function (): number {
		if (this.get('isGallery')) {
			return this.get('current').length;
		} else {
			return -1;
		}
	}.property('isGallery', 'current'),

	/**
	 * @desc observes curentMedia and updates file property
	 * that is an alias from article file and is a queryParam
	 */
	currentMediaObserver: function (): void {
		var currentMedia = this.get('currentMedia');

		if (!currentMedia) {
			this.set('file', null);
			return;
		}

		this.set('file', currentMedia.title);
	}.observes('currentMedia').on('init'),

	/**
	 * @desc returns footer for currentMedia
	 *
	 * @return string
	 */
	footer: function (): string {
		var currentMedia = this.get('currentMedia');

		if (currentMedia) {
			var caption = currentMedia.caption;

			return caption && caption.htmlSafe();
		} else {
			return '';
		}
	}.property('currentMedia'),

	/**
	 * @desc returns header for gallery
	 *
	 * @return string
	 */
	galleryHeader: function (): string {
		return (this.get('currentGalleryRef') + 1) + ' / ' + this.get('galleryLength');
	}.property('galleryLength', 'currentGalleryRef'),

	/**
	 * @desc returns header for currentMedia if it is a gallery
	 *
	 * @return string
	 */
	header: function (): string {
		if (this.get('isGallery')) {
			return this.get('galleryHeader');
		}
		return '';
	}.property('isGallery', 'galleryHeader'),

	/**
	 * @desc sets all properties to their null state
	 */
	reset: function (): void {
		this.setProperties({
			data: {
				mediaRef: null,
				galleryRef: null,
				target: null
			},
			file: null,
			currentMediaRef: null,
			currentGalleryRef: null
		});

		this._super();
	}
});
