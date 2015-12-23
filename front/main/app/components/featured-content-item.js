import Ember from 'ember';
import CuratedContentThumbnailMixin from '../mixins/curated-content-thumbnail';
import ViewportMixin from '../mixins/viewport';
import Thumbnailer from '../../mercury/modules/Thumbnailer';

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
		}),

		viewportObserver: Ember.on('init', Ember.observer('viewportDimensions.width', function () {
			this.updateContainerHeight();
		})),

		/**
		 * Keep the 16:9 ratio
		 *
		 * @returns {void}
		 */
		updateContainerHeight() {
			const containerHeight = String(Math.round((this.get('viewportDimensions.width') / 16) * 9));

			this.set('style', new Ember.Handlebars.SafeString(`height: ${containerHeight}px;`));
		},
	}
);
