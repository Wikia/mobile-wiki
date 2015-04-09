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
		console.log("INIT!")
		this.matchQueryString();

		this._super();
	},

	/**
	 * This function checks if file=* matches any files on a page
	 */
	matchQueryString: function (galleryId: number): void {
		var file = this.get('file');
		console.log("matchQueryString w galerii o numerze: ", this.get('currentMediaRef'))
		console.log("moj param powinno byc to samo: ", galleryId)

		function findMediaInGallery (key: number): Function {
			console.log("tajemniczy key - INDEX GALERII ######: ", key)
			return function (galleryMedia: any, galleryKey: number): boolean {
				console.log("sprawdzam element: ", galleryMedia.title)
				console.log("na pozycji ", galleryKey)
				console.log("czy równa się file: ", file)
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
			console.log("findMedia: ", media.title, "key: ", key);
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

	findMediaInSpecifiedGallery: function (galleryId: number) {
		var file = this.get('file');
		console.log("Szukam pliku: ", file, " w galerii nr: ", galleryId)

		var thisGallery = this.get('model').get('media')[galleryId];
		console.log("thisGallery: ", thisGallery)
		for (var i = 0; i < thisGallery.length; i++) {
			console.log("t", thisGallery[i].title)
			if (thisGallery[i].title === file) {
				console.log("znalezłem media na pozycji", i)
				this.setProperties({
					currentMediaRef: galleryId,
					currentGalleryRef: i
				});
				return true;
			}
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
			return this.get('data.galleryRef') || 0
		}
	}.property('data.galleryRef'),

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
	 * closes lightbox when file queryParam is not set
	 * otherwise tries to open image lightbox with appropriate image
	 */
	fileObserver: function (): void {
		console.log('\n\n\n\n\nNOWy OBRAZEK')
		if (this.get('file') == null) {
			this.send('closeLightbox');
		} else {
			var currentGalleryId = this.get('currentMediaRef');
			console.log("currentGalleryId", currentGalleryId)
			//this.matchQueryString(currentGalleryId);
			this.findMediaInSpecifiedGallery(currentGalleryId);
		}
	}.observes('file'),

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
		console.log("resetuje propertiesy")
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
