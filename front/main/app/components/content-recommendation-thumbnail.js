import Ember from 'ember';
import Thumbnailer from 'common/modules/thumbnailer';
import MediaThumbnailUtilsMixin from '../mixins/media-thumbnail-utils';

export default Ember.Component.extend(
	MediaThumbnailUtilsMixin,
	{
		classNames: ['content-recommendation-thumbnail'],
		classNameBindings: ['isLoaded'],
		tagName: 'figure',

		/**
		 * @returns {{mode: string, height: number, width: number}}
		 */
		getThumbnailParams() {
			return {
				mode: Thumbnailer.mode.topCrop,
				height: 200,
				width: this.normalizeThumbWidth(this.$().width())
			};
		},
	}
);
