import Ember from 'ember';
import CuratedContentThumbnailMixin from '../mixins/curated-content-thumbnail';
import ViewportMixin from '../mixins/viewport';
import {track, trackActions} from 'common/utils/track';

export default Ember.Component.extend(
	CuratedContentThumbnailMixin,
	ViewportMixin,
	{
		tagName: 'a',
		attributeBindings: ['href'],
		classNames: ['curated-content-item'],
		classNameBindings: ['type'],
		style: null,
		href: Ember.computed.oneWay('model.url'),
		type: Ember.computed.oneWay('model.type'),

		isArticle: Ember.computed.equal('model.type', 'article'),

		aspectRatio: 1,
		imageWidth: 200,
		thumbUrl: Ember.computed('model', function () {
			if (this.get('model.imageUrl')) {
				return this.generateThumbUrl(
					this.get('model.imageUrl'),
					this.get(`model.imageCrop.${this.get('aspectRatioName')}`)
				);
			} else {
				return this.get('emptyGif');
			}
		}),

		icon: Ember.computed('type', function () {
			const type = this.get('type'),
				typesWithDedicatedIcon = ['category', 'video', 'image', 'blog'];

			let iconType;

			if (typesWithDedicatedIcon.indexOf(type) > -1) {
				iconType = type;
			} else if (type === 'section') {
				// Sections use the same icons as categories
				iconType = 'category';
			} else {
				// Default icon
				iconType = 'article';
			}

			return `namespace-${iconType}`;
		}),

		viewportObserver: Ember.on('init', Ember.observer('viewportDimensions.width', function () {
			this.updateImageSize();
		})),

		/**
		 * @returns {boolean}
		 */
		click() {
			const itemType = this.get('type');

			track({
				action: trackActions.click,
				category: 'main-page-curated-content',
				label: `open-item-${this.get('index')}`
			});

			if (itemType && itemType === 'section' || itemType === 'category') {
				this.sendAction('openCuratedContentItem', this.get('model'));
				return false;
			}
		},

		/**
		 * @returns {void}
		 */
		updateImageSize() {
			const imageSize = String(Math.floor((this.get('viewportDimensions.width') - 20) / 2));

			this.set('style', new Ember.Handlebars.SafeString(`height: ${imageSize}px; width: ${imageSize}px;`));
		}
	}
);
