/// <reference path="./LightboxController.ts" />
'use strict';

App.MediaLightboxController = App.LightboxController.extend({
	needs: 'article',

	file: Em.computed.alias(
		'controllers.article.file'
	),
	currentMediaRef: null,
	//default image in gallery is 0th
	currentGalleryRef: 0,
	//element on a page that will be animated
	element: null,

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
			this.get('model.media').some(findMedia, this);
		}
	},

	init: function () {
		this.set('model', App.MediaModel);

		this.matchQueryString();
	},

	galleryBoundries: function () {
		var currentGalleryRef = this.get('currentGalleryRef'),
			galleryLength = this.get('galleryLength') - 1;

		if (currentGalleryRef < 0) {
			this.set('currentGalleryRef', galleryLength);
		} else if (currentGalleryRef > galleryLength) {
			this.set('currentGalleryRef', 0);
		}

	}.observes('currentGalleryRef', 'galleryLength'),

	isGallery: function () {
		return Em.isArray(this.get('current'));
	}.property('current'),

	current: function () {
		return this.get('model').find(this.get('currentMediaRef'));
	}.property('model', 'currentMediaRef'),

	currentMedia: function () {
		var current = this.get('current');

		if (this.get('isGallery')) {
			return current[this.get('currentGalleryRef')];
		} else {
			return current;
		}
	}.property('current', 'isGallery', 'currentGalleryRef'),

	galleryLength: function () {
		if (this.get('isGallery')) {
			return this.get('current').length;
		} else {
			return false;
		}
	}.property('isGallery', 'current'),

	currentMediaObserver: function () {
		var currentMedia = this.get('currentMedia');

		if (currentMedia) {
			this.set('file', currentMedia.title);
		} else {
			this.set('file', null);
		}
	}.observes('currentMedia').on('init'),

	contents: function () {
		var currentMedia = this.get('currentMedia');

		if (currentMedia) {
			return ('<img src="' + this.get('currentMedia').url + '">').htmlSafe();
		} else {
			return i18n.t('app:media-lightbox-error');
		}
	}.property('currentMedia'),

	footer: function () {
		var currentMedia = this.get('currentMedia');

		if (currentMedia) {
			var caption = currentMedia.caption;

			return caption && caption.htmlSafe();
		} else {
			return '';
		}
	}.property('currentMedia'),

	galleryHeader: function () {
		return (this.get('currentGalleryRef') + 1) + ' / ' + this.get('galleryLength');
	}.property('galleryLength', 'currentGalleryRef'),

	header: function () {
		if (this.get('isGallery')) {
			return this.get('galleryHeader');
		}
		return '';
	}.property('isGallery', 'galleryHeader'),

	reset: function () {
		this.setProperties({
			currentMediaRef: null,
			currentGalleryRef: 0,
			file: null
		});
	}
});
