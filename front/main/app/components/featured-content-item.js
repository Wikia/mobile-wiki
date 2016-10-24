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
		style: null,
		href: Ember.computed.oneWay('model.article_local_url'),

		aspectRatio: 16 / 9,
		imageWidth: 400,
		cropMode: Thumbnailer.mode.zoomCrop,
		thumbUrl: Ember.computed('model', function () {
			return this.generateThumbUrl(
				this.get('model.image_url'),
				this.get(`model.image_crop.${this.get('aspectRatioName')}`)
			);
		})
	}
);
