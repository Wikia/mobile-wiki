import Ember from 'ember';
import Thumbnailer from 'common/modules/Thumbnailer';

export default Ember.Component.extend(
	{
		classNames: ['article-media-linked-gallery'],
		attributeBindings: ['data-ref'],

		'data-ref': Ember.computed.oneWay('ref'),

		imageSize: 195,
		cropMode: Thumbnailer.mode.topCrop,
		numberOfItemsRendered: 4,

		canShowMore: Ember.computed('items', 'numberOfItemsRendered', function () {
			return this.get('items.length') > this.get('numberOfItemsRendered');
		}),

		sortedItems: Ember.computed.sort('sanitizedItems', function (a, b) {
			if (a.link && typeof b.link === 'undefined') {
				return 1;
			} else if (b.link && typeof a.link === 'undefined') {
				return -1;
			}

			return 0;
		}),

		sanitizedItems: Ember.computed.map('items', function(item, index) {
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
			showMore() {
				this.set('numberOfItemsRendered', this.get('items.length'));
			}
		},
	}
);
