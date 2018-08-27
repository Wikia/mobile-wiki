import Component from '@ember/component';
import { computed } from '@ember/object';
import { equal, oneWay } from '@ember/object/computed';
import CuratedContentThumbnailMixin from '../mixins/curated-content-thumbnail';
import { track, trackActions } from '../utils/track';

export default Component.extend(
	CuratedContentThumbnailMixin,
	{
		tagName: 'a',
		attributeBindings: ['href'],
		classNames: ['curated-content-item'],
		classNameBindings: ['type'],

		aspectRatio: 1,
		imageWidth: 200,
		imageLoaded: false,

		openSection() {},

		href: oneWay('model.url'),
		type: oneWay('model.type'),

		isArticle: equal('model.type', 'article'),

		thumbUrl: computed('model', function () {
			if (this.get('model.imageUrl')) {
				return this.generateThumbUrl(
					this.get('model.imageUrl'),
					this.get(`model.imageCrop.${this.aspectRatioName}`),
				);
			} else {
				return this.emptyGif;
			}
		}),

		icon: computed('type', function () {
			const type = this.type;
			const typesWithDedicatedIcon = {
				category: 'grid',
				video: 'play',
				image: 'image',
				blog: 'clock',
				section: 'grid',
			};

			// we use here following Design System icons
			// wds-icons-grid, wds-icons-play, wds-icons-image, wds-icons-clock, wds-icons-article
			return `wds-icons-${typesWithDedicatedIcon[type] || 'article'}`;
		}),

		/**
		 * @returns {boolean}
		 */
		click() {
			const itemType = this.type;

			track({
				action: trackActions.click,
				category: 'main-page-curated-content',
				label: `open-item-${this.index}`,
			});

			if (itemType && itemType === 'section') {
				this.openSection(this.model);
				return false;
			}

			return undefined;
		},
	},
);
