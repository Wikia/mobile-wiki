define('mobile-wiki/components/article-media-gallery', ['exports', 'ember-in-viewport', 'mobile-wiki/modules/thumbnailer'], function (exports, _emberInViewport, _thumbnailer) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = Ember.Component.extend(_emberInViewport.default, {
		classNames: ['article-media-gallery'],

		imageSize: 195,
		cropMode: _thumbnailer.default.mode.topCrop,
		// Initially it limits how many item components get rendered before user scrolls to a gallery
		numberOfItemsRendered: 2,
		incrementStepSize: 10,

		/**
   * We don't want to render all child components because galleries can be big
   * Initially, we render this.numberOfItemsRendered components
   * Then increment this number in this.didEnterViewport and this.onScroll
   */
		itemsToRender: Ember.computed('items', 'numberOfItemsRendered', function () {
			return this.get('items').slice(0, this.get('numberOfItemsRendered'));
		}),

		/**
   * @returns {void}
   */
		didReceiveAttrs: function didReceiveAttrs() {
			this.sanitizeItems();
		},


		/**
   * @returns {void}
   */
		didRender: function didRender() {
			var _this = this;

			this.$().on('scroll', function () {
				Ember.run.debounce(_this, 'onScroll', 100);
			});
		},


		/**
   * @returns {void}
   */
		didEnterViewport: function didEnterViewport() {
			this.incrementProperty('numberOfItemsRendered', this.incrementStepSize);
		},


		actions: {
			openLightbox: function openLightbox(galleryRef) {
				// openLightbox is set in getAttributesForMedia() inside utils/article-media.js
				this.get('openLightbox')(this.get('ref'), galleryRef);
			}
		},

		/**
   * This should be done in the model, really
   *
   * @returns {void}
   */
		sanitizeItems: function sanitizeItems() {
			var itemsSanitized = Ember.A(),
			    itemsRaw = this.get('items');

			itemsRaw.forEach(function (mediaItem, index) {
				mediaItem.galleryRef = index;
				itemsSanitized.pushObject(Ember.Object.create(mediaItem));
			});

			this.set('items', itemsSanitized);
		},


		/**
   * Make sure that there is always a buffer of components rendered outside of the view
   * Images aren't loaded here, we just increment the number of components to render
   *
   * @returns {void}
   */
		onScroll: function onScroll() {
			var $this = this.$(),
			    scrollOffset = $this.scrollLeft() + $this.width(),
			    numberOfItemsRendered = this.get('numberOfItemsRendered'),
			    totalNumberOfItems = this.get('items.length'),

			// article-media-thumbnail width is the same as imageSize plus margin defined in CSS
			itemWidth = this.imageSize + 8,
			    renderedItemsWidth = numberOfItemsRendered * itemWidth,
			    bufferWidth = renderedItemsWidth - scrollOffset,
			    bufferSize = Math.floor(bufferWidth / this.imageSize),
			    minBufferSize = this.incrementStepSize / 2;

			if (bufferSize < minBufferSize) {
				this.incrementProperty('numberOfItemsRendered', this.incrementStepSize);
			} else if (numberOfItemsRendered < totalNumberOfItems) {
				// Make sure that some math error above doesn't cause images to not load
				this.set('numberOfItemsRendered', totalNumberOfItems);
			} else {
				$this.off('scroll');
			}
		}
	});
});