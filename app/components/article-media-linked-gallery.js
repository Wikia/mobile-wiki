import {sort, map} from '@ember/object/computed';
import {computed} from '@ember/object';
import Component from '@ember/component';
import Thumbnailer from '../modules/thumbnailer';

export default Component.extend(
	{
		classNames: ['article-media-linked-gallery'],

		imageSize: 195,
		cropMode: Thumbnailer.mode.topCrop,
		numberOfItemsRendered: 4,

		canShowMore: computed('items', 'numberOfItemsRendered', function () {
			return this.get('items.length') > this.get('numberOfItemsRendered');
		}),

		sortedItems: sort('sanitizedItems', (a, b) => {
			if (a.isLinkedByUser && !b.isLinkedByUser) {
				return 1;
			} else if (b.isLinkedByUser && !a.isLinkedByUser) {
				return -1;
			}

			return 0;
		}),

		sanitizedItems: map('items', (item, index) => {
			item.galleryRef = index;
			return item;
		}),

		/**
		 * We don't want to render all child components because galleries can be big
		 * Initially, we render this.numberOfItemsRendered components
		 * Then increment this number in this.showMore
		 */
		itemsToRender: computed('sortedItems', 'numberOfItemsRendered', function () {
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
