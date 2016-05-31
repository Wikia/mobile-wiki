import Ember from 'ember';
import Thumbnailer from 'common/modules/thumbnailer';
import MediaThumbnailUtilsMixin from '../mixins/media-thumbnail-utils';

export default Ember.Component.extend(
	MediaThumbnailUtilsMixin,
	{
		// we want to re-use styles from article-media-thumbnail component
		classNames: ['article-media-thumbnail'],
		classNameBindings: ['isLoading'],
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
