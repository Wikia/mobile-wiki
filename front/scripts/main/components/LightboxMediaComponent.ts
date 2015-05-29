/// <reference path="../models/MediaModel.ts" />
'use strict';

App.LightboxMediaComponent = Em.Component.extend(App.ThirdsClickMixin, {
	// FIXME: lightbox-content is duplicated as a temp styling fix
	classNames: ['lightbox-media', 'lightbox-content'],
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
		return this.get('model.media').find(this.get('model.mediaRef'));
	}),

	/**
	 * @desc gets current media or current media from gallery
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

	currentGalleryRef: Em.computed('model.media.galleryRef', {
		get(): number {
			return this.get('model.media.galleryRef') || 0;
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
		if (this.get('isGallery')) {
			return this.get('current').length;
		} else {
			return -1;
		}
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
		this.setHeader();
		this.setFooter();
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

	actions: {
		showError: function (): void {
			//FIXME
			this.set('lightboxComponent', null);
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
		this.get('controller').incrementProperty('currentGalleryRef');

		M.track({
			action: M.trackActions.paginate,
			category: 'lightbox',
			label: 'next'
		});
	},

	prevMedia: function (): void {
		this.get('controller').decrementProperty('currentGalleryRef');

		M.track({
			action: M.trackActions.paginate,
			category: 'lightbox',
			label: 'previous'
		});
	},

	setHeader: function (): void {
		var header: string = null;

		if (this.get('isGallery')) {
			header = (this.get('currentGalleryRef') + 1) + ' / ' + this.get('galleryLength');
		}

		this.set('header', header);
	},

	setFooter: function (): void {
		var currentMedia: ArticleMedia = this.get('currentMedia'),
			footer: string = null;

		if (currentMedia && currentMedia.caption) {
			footer = currentMedia.caption;
		}

		this.set('footer', footer);
	},

	//
	///**
	// * @desc observes curentMedia and updates file property
	// * that is an alias from article file and is a queryParam
	// */
	//currentMediaObserver: Em.observer('currentMedia', function (): void {
	//	var currentMedia = this.get('currentMedia');
	//
	//	if (!currentMedia) {
	//		this.set('file', null);
	//		return;
	//	}
	//
	//	this.set('file', currentMedia.title);
	//}).on('init'),
	//
	///**
	// * @desc sets all properties to their null state
	// */
	//reset: function (): void {
	//	this.setProperties({
	//		data: {
	//			mediaRef: null,
	//			galleryRef: null,
	//			target: null
	//		},
	//		file: null,
	//		currentMediaRef: null,
	//		currentGalleryRef: null
	//	});
	//
	//	this._super();
	//}
	///**
	// * @desc used to animate image that is in article into a media lightbox
	// */
	//animateMedia: function (image?: HTMLElement): void {
	//	if (image) {
	//		var $image = $(image).find('img'),
	//			offset = $image.offset(),
	//			$imageCopy = $image.clone(),
	//			width = $image.width(),
	//			viewportSize = this.get('viewportSize'),
	//			deviceWidth = viewportSize.width;
	//
	//		//initial style, mimic the image that is in page
	//		$imageCopy.css({
	//			top: offset.top - window.scrollY + 'px',
	//			left: offset.left + 'px',
	//			width: width + 'px'
	//			//for static css properties see _media_lightbox.scss
	//		}).addClass('animated-media');
	//
	//		this.$().append($imageCopy);
	//
	//		//animate to full width and middle of screen
	//		$imageCopy.css({
	//			width: deviceWidth + 'px',
	//			//half of - device height minus height of the animated image multiplied by scale
	//			top: ((viewportSize.height - ($image.height() * (deviceWidth / width))) / 2) + 'px',
	//			left: 0
	//		}).one('webkitTransitionEnd, transitionend', function () {
	//			$imageCopy.remove();
	//		});
	//	}
	//},
	//
	//file: Em.computed.alias(
	//	'controllers.article.file'
	//),
	//data: {
	//	mediaRef: null,
	//	galleryRef: null,
	//	target: null
	//},
	////standard place where other components can set data for media lightbox
	//currentMediaRef: Em.computed.alias(
	//	'data.mediaRef'
	//),
	////element on a page that will be animated
	//element: Em.computed.alias(
	//	'data.target'
	//),
	//model: Em.computed.oneWay(
	//	'controllers.article.model.media'
	//),
	//
	//init: function (): void {
	//	//this.matchQueryString();
	//
	//	//this._super();
	//},
	//
	///**
	// * @desc Checks if file from URL matches with currentMedia.
	// * Handles situation when file is empty and when,
	// * 'back' button is pressed and other unexpected situations.
	// */
	//fileObserver: Em.observer('file', function (): void {
	//	var currentMedia = this.get('currentMedia'),
	//		file = this.get('file');
	//
	//	if (currentMedia && currentMedia.title !== file) {
	//		this.send('closeLightbox');
	//	}
	//}),
	//
	///**
	// * @desc checks if file=* matches any files on a page
	// */
	//matchQueryString: function (): void {
	//	var file = this.get('file');
	//
	//	function findMediaInGallery (key: number): Function {
	//		return function (galleryMedia: any, galleryKey: number): boolean {
	//			if (galleryMedia.title === file) {
	//				this.setProperties({
	//					currentMediaRef: key,
	//					currentGalleryRef: galleryKey
	//				});
	//
	//				return true;
	//			} else {
	//				return false;
	//			}
	//		};
	//	}
	//
	//	function findMedia (media: any, key: number): boolean {
	//		if (Em.isArray(media)) {
	//			return media.some(findMediaInGallery(key), this);
	//		} else if (media.title === file) {
	//			this.set('currentMediaRef', key);
	//
	//			return true;
	//		}
	//
	//		return false;
	//	}
	//
	//	if (!Em.isEmpty(file)) {
	//		this.get('model').get('media').some(findMedia, this);
	//	}
	//},
});
