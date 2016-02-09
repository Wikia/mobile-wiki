import Ember from 'ember';
import InViewportMixin from 'ember-in-viewport';
import Thumbnailer from 'common/modules/Thumbnailer';

export default Ember.Component.extend(
	InViewportMixin,
	{
		classNames: ['article-media-gallery'],
		attributeBindings: ['data-ref'],

		'data-ref': Ember.computed.oneWay('ref'),

		imageSize: 195,
		cropMode: Thumbnailer.mode.topCrop,

		didReceiveAttrs() {
			const itemsSanitized = Ember.A(),
				itemsRaw = this.get('items');

			// This sanitization should be done in the model, really
			itemsRaw.forEach((mediaItem, index) => {
				mediaItem.galleryRef = index;
				itemsSanitized.pushObject(Ember.Object.create(mediaItem));
			});

			this.set('items', itemsSanitized);
		}
	}
);
