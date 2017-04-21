import Ember from 'ember';
import ViewportMixin from '../mixins/viewport';
import VideoLoader from '../modules/video-loader';

var ooyalaMock = {
	provider: 'ooyala-v4',
	noAds: true,
	jsParams: {
		videoId: 'hwM2FkOTE6R_fZR9uu5jvOy9FHm3NS1O',
	},
};

/**
 * Component that is used inside ligthbox-media component
 * to handle displaying video
 */
export default Ember.Component.extend(
	{
		/**
		 * @returns VideoLoader
		 */
		videoLoader: Ember.computed('model.embed', function () {
			return new VideoLoader(ooyalaMock);
		}),

		/**
		 * @returns {void}
		 */
		didRender() {
			this.initVideoPlayer();
		},

		/**
		 * Used to instantiate a video player
		 *
		 * @returns {void}
		 */
		initVideoPlayer() {
			const videoLoader = this.get('videoLoader');

			/**
			 * This loads and creates a player
			 */
			videoLoader.loadPlayerClass();
		},
	}
);
