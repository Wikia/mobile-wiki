/// <reference path="../models/MediaModel.ts" />
'use strict';

App.LightboxMediaComponent = Em.Component.extend(
	App.ThirdsClickMixin,
	{
		classNames: ['lightbox-media', 'lightbox-content-inner'],
		// This is needed for keyDown event to work
		attributeBindings: ['tabindex'],
		tabindex: 0,
		videoPlayer: null,

		/**
		 * gets current media from model
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
		 * gets current media or current media from gallery
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
			},
		}),

		galleryLength: Em.computed('isGallery', 'current', function (): number {
			return this.get('isGallery') ? this.get('current').length : -1;
		}),

		/**
		 * checks if current displayed media is a gallery
		 */
		isGallery: Em.computed('current', function (): boolean {
			return Em.isArray(this.get('current'));
		}),

		/**
		 * checks if current media is a video or image and which lightbox component to render
		 */
		lightboxComponent: Em.computed('currentMedia', function (): string {
			var currentMedia: ArticleMedia = this.get('currentMedia');
			return currentMedia && currentMedia.url && currentMedia.type ? 'lightbox-' + currentMedia.type : null;
		}),

		modelObserver: Em.observer('model', 'currentMedia', function (): void {
			this.updateState();
		}),

		gestures: {
			/**
			 * @returns {undefined}
			 */
			swipeLeft(): void {
				if (this.get('isGallery')) {
					this.nextMedia();
				}
			},

			/**
			 * @returns {undefined}
			 */
			swipeRight(): void {
				if (this.get('isGallery')) {
					this.prevMedia();
				}
			},
		},

		/**
		 * @returns {undefined}
		 */
		didInsertElement(): void {
			// this.updateState modifies header and footer rendered in LightboxWrapperComponent
			// This isn't allowed by Ember to do on didInsertElement
			// That's why we need to schedule it in the afterRender queue
			Em.run.scheduleOnce('afterRender', this, (): void => {
				this.updateState();
			});
		},

		/**
		 * @param {MouseEvent} event
		 * @returns {undefined}
		 */
		click(event: MouseEvent): void {
			if (this.get('isGallery')) {
				this.callClickHandler(event, true);
			} else {
				this._super(event);
			}
		},

		/**
		 * @param {JQueryEventObject} event
		 * @returns {undefined}
		 */
		keyDown(event: JQueryEventObject): void {
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

		/**
		 * @returns {boolean}
		 */
		rightClickHandler(): boolean {
			this.nextMedia();
			return true;
		},

		/**
		 * @returns {boolean}
		 */
		leftClickHandler(): boolean {
			this.prevMedia();
			return true;
		},

		/**
		 * @returns {boolean}
		 */
		centerClickHandler(): boolean {
			// Bubble up
			return false;
		},

		/**
		 * @returns {undefined}
		 */
		nextMedia(): void {
			this.incrementProperty('currentGalleryRef');

			M.track({
				action: M.trackActions.paginate,
				category: 'lightbox',
				label: 'next'
			});
		},

		/**
		 * @returns {undefined}
		 */
		prevMedia(): void {
			this.decrementProperty('currentGalleryRef');

			M.track({
				action: M.trackActions.paginate,
				category: 'lightbox',
				label: 'previous'
			});
		},

		/**
		 * @returns {undefined}
		 */
		updateState(): void {
			this.updateHeader();
			this.updateFooter();

			this.sendAction('setQueryParam', 'file', M.String.normalizeToUnderscore(this.get('currentMedia.title')));
		},

		/**
		 * @returns {undefined}
		 */
		updateHeader(): void {
			var header: string = null;

			if (this.get('isGallery')) {
				header = (this.get('currentGalleryRef') + 1) + ' / ' + this.get('galleryLength');
			}

			this.sendAction('setHeader', header);
		},

		/**
		 * @returns {undefined}
		 */
		updateFooter(): void {
			var currentMedia: ArticleMedia = this.get('currentMedia');

			if (currentMedia && currentMedia.caption) {
				this.sendAction('setFooter', new Em.Handlebars.SafeString(currentMedia.caption));
			} else {
				this.sendAction('setFooter', null);
			}
		},
	}
);
