import Ember from 'ember';
import ArticleContentMixin from '../mixins/article-content';
import VideoLoader from 'common/modules/VideoLoader';

export default Ember.Component.extend(
	ArticleContentMixin,
	{
		classNames: ['lightbox-video', 'lightbox-content-inner'],
		classNameBindings: ['provider'],

		articleContentWidthObserver: Ember.observer('articleContent.width', function () {
			if (this.get('videoLoader')) {
				this.get('videoLoader').onResize();
			}
		}),

		/**
		 * @returns string
		 */
		provider: Ember.computed('videoLoader', function () {
			const videoLoader = this.get('videoLoader');

			return `video-provider-${videoLoader.getProviderName()}`;
		}),

		/**
		 * @return VideoLoader
		 */
		videoLoader: Ember.computed('model.embed', function () {
			return new VideoLoader(this.get('model.embed'));
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
			const videoLoader = this.get('videoLoader'),
				player = videoLoader.loadPlayerClass();

			// Stop bubbling it up to the lightbox
			this.$(player.containerSelector).click(() => false);
		},
	}
);
