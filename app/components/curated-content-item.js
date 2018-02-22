import {computed} from '@ember/object';
import {oneWay, equal} from '@ember/object/computed';
import Component from '@ember/component';
import CuratedContentThumbnailMixin from '../mixins/curated-content-thumbnail';
import {track, trackActions} from '../utils/track';

export default Component.extend(
	CuratedContentThumbnailMixin,
	{
		tagName: 'a',
		attributeBindings: ['href'],
		classNames: ['curated-content-item'],
		classNameBindings: ['type'],

		aspectRatio: 1,
		imageWidth: 200,

		openSection() {},

		href: oneWay('model.url'),
		type: oneWay('model.type'),

		isArticle: equal('model.type', 'article'),

		thumbUrl: computed('model', function () {
			if (this.get('model.imageUrl')) {
				return this.generateThumbUrl(
					this.get('model.imageUrl'),
					this.get(`model.imageCrop.${this.get('aspectRatioName')}`)
				);
			} else {
				return this.get('emptyGif');
			}
		}),

		icon: computed('type', function () {
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

			if (itemType && itemType === 'section') {
				this.get('openSection')(this.get('model'));
				return false;
			}
		}
	}
);
