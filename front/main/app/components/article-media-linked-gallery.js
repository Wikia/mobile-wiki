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

		/**
		 * We don't want to render all child components because galleries can be big
		 * Initially, we render this.numberOfItemsRendered components
		 * Then increment this number in this.showMore
		 */
		itemsToRender: Ember.computed('items', 'numberOfItemsRendered', function () {
			return this.get('items').slice(0, this.get('numberOfItemsRendered'));
		}),

		/**
		 * @returns {void}
		 */
		didReceiveAttrs() {
			this.sanitizeItems();
		},

		actions: {
			showMore() {
				this.set('numberOfItemsRendered', this.get('items.length'));
			}
		},

		/**
		 * This should be done in the model, really
		 *
		 * @returns {void}
		 */
		sanitizeItems() {
			const itemsSanitized = Ember.A(),
				itemsRaw = this.get('items');

			itemsRaw.forEach((mediaItem, index) => {
				mediaItem.galleryRef = index;
				itemsSanitized.pushObject(Ember.Object.create(mediaItem));
			});


			this.set('items', itemsSanitized.sort(this.sortMedia));
		},

		/**
		 * Sorts media by a simple criterion: if it's linked or not
		 *
		 * @param {ArticleMedia} a
		 * @param {ArticleMedia} b
		 * @returns {number}
		 */
		sortMedia(a, b) {
			if (a.link && typeof b.link === 'undefined') {
				return 1;
			} else if (b.link && typeof a.link === 'undefined') {
				return -1;
			}

			return 0;
		},
	}
);
