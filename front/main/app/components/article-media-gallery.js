import Ember from 'ember';
import VisibleMixin from '../mixins/visible';
import Thumbnailer from 'common/modules/Thumbnailer';

export default Ember.Component.extend(
	VisibleMixin,
	{
		classNames: ['article-media-gallery'],

		imageSize: 195,
		cropMode: Thumbnailer.mode.topCrop,

		actions: {
			/**
			 * @returns {void}
			 */
			onVisible() {
				const mediaArray = Ember.A(),
					items = this.get('items');

				// FIXME this is called twice for every instance, once with items existing and once without them
				if (items) {
					this.get('items').forEach((mediaItem, index) => {
						mediaItem.galleryRef = index;
						mediaArray.pushObject(Ember.Object.create(mediaItem));
					});

					this.setProperties({
						items: mediaArray,
						//limit: this.incrementLimitValue,
						//galleryLength: mediaArray.length
					});
				}
			}
		}
	}
);
