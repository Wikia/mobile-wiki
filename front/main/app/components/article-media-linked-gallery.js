import Ember from 'ember';
import Thumbnailer from 'common/modules/Thumbnailer';

export default Ember.Component.extend(
	{
		classNames: ['article-media-linked-gallery'],
		attributeBindings: ['data-ref'],

		'data-ref': Ember.computed.oneWay('ref'),

		imageSize: 195,
		cropMode: Thumbnailer.mode.topCrop,

		/**
		 * @returns {void}
		 */
		didReceiveAttrs() {
			this.sanitizeItems();
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

			this.set('items', itemsSanitized);
		}
	}
);
