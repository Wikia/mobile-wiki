import {computed} from '@ember/object';
import {oneWay} from '@ember/object/computed';
import Component from '@ember/component';
import CuratedContentThumbnailMixin from '../mixins/curated-content-thumbnail';
import ViewportMixin from '../mixins/viewport';
import Thumbnailer from '../modules/thumbnailer';

export default Component.extend(
	CuratedContentThumbnailMixin,
	ViewportMixin,
	{
		tagName: 'a',
		attributeBindings: ['href', 'style'],
		classNames: ['featured-content-item'],
		href: oneWay('model.url'),

		aspectRatio: 16 / 9,
		imageWidth: 400,
		cropMode: Thumbnailer.mode.zoomCrop,
		thumbUrl: computed('model', function () {
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
