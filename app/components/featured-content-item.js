import { computed } from '@ember/object';
import { oneWay } from '@ember/object/computed';
import Component from '@ember/component';
import CuratedContentThumbnailMixin from '../mixins/curated-content-thumbnail';
import Thumbnailer from '../modules/thumbnailer';

export default Component.extend(
	CuratedContentThumbnailMixin,
	{
		tagName: 'a',
		attributeBindings: ['href', 'style'],
		classNames: ['featured-content-item', 'wds-font-size-xxl'],

		imageWidth: 400,
		href: oneWay('model.url'),

		thumbUrl: computed('model', function () {
			const imageUrl = this.get('model.imageUrl');

			if (imageUrl) {
				return this.generateThumbUrl(
					imageUrl,
					this.get(`model.imageCrop.${this.aspectRatioName}`)
				);
			}

			return this.emptyGif;
		}),

		// TODO it's not treated as valid property
		aspectRatio: 16 / 9,
		cropMode: Thumbnailer.mode.zoomCrop
	}
);
