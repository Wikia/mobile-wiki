import Ember from 'ember';
import Thumbnailer from 'common/modules/thumbnailer';

export default Ember.Component.extend(
	{
		classNames: ['article-media-linked-gallery'],

		imageSize: 195,
		cropMode: Thumbnailer.mode.topCrop,
		numberOfItemsRendered: 4,

		canShowMore: Ember.computed('items', 'numberOfItemsRendered', function () {
			return this.get('items.length') > this.get('numberOfItemsRendered');
		}),

		sortedItems: Ember.computed.sort('sanitizedItems', (a, b) => {
			if (a.link && typeof b.link === 'undefined') {
				return 1;
			} else if (b.link && typeof a.link === 'undefined') {
				return -1;
			}

			return 0;
		}),

		sanitizedItems: Ember.computed.map('items', (item, index) => {
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
			openLightbox(galleryRef) {
				// openLightbox is set in getAttributesForMedia() inside utils/article-media.js
				this.get('openLightbox')(this.get('ref'), galleryRef);
			},
			showMore() {
				this.set('numberOfItemsRendered', this.get('items.length'));
			}
		},
	}
);
