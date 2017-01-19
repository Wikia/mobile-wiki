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
			const imageUrl = this.get('model.imageUrl');

			if (imageUrl) {
				return this.generateThumbUrl(
					imageUrl,
					this.get(`model.imageCrop.${this.get('aspectRatioName')}`)
				);
			}

			return this.get('emptyGif');
		})
	}
);
