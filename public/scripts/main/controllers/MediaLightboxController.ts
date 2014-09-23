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

	currentGalleryRef: function (key: string, value, number): number {
		var galleryLength = this.get('galleryLength') - 1;

		if (arguments.length > 1) {
			if (value < 0) {
				return galleryLength;
			} else if (value > galleryLength) {
				return 0;
			}
		}

		return value == null ? this.getWithDefault('data.galleryRef', 0) : value;
	}.property(),

	/**
	 * check if current displayed media is a gallery
	 *
	 * @return boolean
	 */
	isGallery: function (): boolean {
		return Em.isArray(this.get('current'));
	}.property('current'),

	/**
	 * gets current media from model
	 *
	 * @return object
	 */
	current: function (): ArticleMedia {
		return this.get('model').find(this.get('currentMediaRef'));
	}.property('model', 'currentMediaRef'),

	/**
	 * gets current media or current media from gallery
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
	 * observes curentMedia and updates file property
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
	 * returns footer for currentMedia
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
	 * returns header for gallery
	 *
	 * @return string
	 */
	galleryHeader: function (): string {
		return (this.get('currentGalleryRef') + 1) + ' / ' + this.get('galleryLength');
	}.property('galleryLength', 'currentGalleryRef'),

	/**
	 * returns header for currentMedia if it is a gallery
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
