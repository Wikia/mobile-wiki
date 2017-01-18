import Ember from 'ember';
import CuratedContentThumbnailMixin from '../mixins/curated-content-thumbnail';
import ViewportMixin from '../mixins/viewport';
import Thumbnailer from 'common/modules/thumbnailer';

export default Ember.Component.extend(
	CuratedContentThumbnailMixin,
	ViewportMixin,
	{
		tagName: 'a',
		attributeBindings: ['href', 'style'],
		classNames: ['featured-content-item'],
		href: Ember.computed.oneWay('model.url'),

		aspectRatio: 16 / 9,
		imageWidth: 400,
		cropMode: Thumbnailer.mode.zoomCrop,
		thumbUrl: Ember.computed('model', function () {
			if (this.get('model.imageUrl')) {
				return this.generateThumbUrl(
					this.get('model.imageUrl'),
					this.get(`model.imageCrop.${this.get('aspectRatioName')}`)
				);
			} else {
				return this.get('emptyGif');
			}
		})
	}
);
