define('mobile-wiki/components/article-media-linked-gallery', ['exports', 'mobile-wiki/modules/thumbnailer'], function (exports, _thumbnailer) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = Ember.Component.extend({
		classNames: ['article-media-linked-gallery'],

		imageSize: 195,
		cropMode: _thumbnailer.default.mode.topCrop,
		numberOfItemsRendered: 4,

		canShowMore: Ember.computed('items', 'numberOfItemsRendered', function () {
			return this.get('items.length') > this.get('numberOfItemsRendered');
		}),

		sortedItems: Ember.computed.sort('sanitizedItems', function (a, b) {
			if (a.isLinkedByUser && !b.isLinkedByUser) {
				return 1;
			} else if (b.isLinkedByUser && !a.isLinkedByUser) {
				return -1;
			}

			return 0;
		}),

		sanitizedItems: Ember.computed.map('items', function (item, index) {
			item.galleryRef = index;
			return item;
		}),

		/**
   * We don't want to render all child components because galleries can be big
   * Initially, we render this.numberOfItemsRendered components
   * Then increment this number in this.showMore
   */
		itemsToRender: Ember.computed('sortedItems', 'numberOfItemsRendered', function () {
			return this.get('sortedItems').slice(0, this.get('numberOfItemsRendered'));
		}),

		actions: {
			openLightbox: function openLightbox(galleryRef) {
				// openLightbox is set in getAttributesForMedia() inside utils/article-media.js
				this.get('openLightbox')(this.get('ref'), galleryRef);
			},
			showMore: function showMore() {
				this.set('numberOfItemsRendered', this.get('items.length'));
			}
		}
	});
});