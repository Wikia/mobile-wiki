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
	ViewportMixin,
	{
		classNameBindings: ['provider'],
		wrapperClass: '.video-player-wrapper',

		adsState: Ember.inject.service(),

		articleContentWidthObserver: Ember.observer('viewportDimensions.width', function () {
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
		 * @returns VideoLoader
		 */
		videoLoader: Ember.computed('model.embed', function () {
			// this.set('model.embed.noAds', this.get('adsState.noAds'));

			return new VideoLoader(ooyalaMock);
		}),

		/**
		 * @returns {void}
		 */
		didRender() {
			this.insertVideoPlayerHtml();
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

			// Stop bubbling it up to the lightbox
			this.$(this.wrapperClass).on(`click.${this.id}`, () => false);
		},

		/**
		 * Since we don't use Ember to inject video HTML
		 *
		 * Video code does interact with the DOM and brakes binding for Ember templates
		 * therefore whenever video changes in lightbox
		 * Ember would not know what to update
		 *
		 * because of that we have to manage it manually
		 *
		 * @returns {void}
		 */
		insertVideoPlayerHtml() {
			this.$(this.wrapperClass).html(this.get('model.embed.html'));
		},

		/**
		 * Unbind all click events
		 *
		 * @returns {void}
		 */
		willDestroyElement() {
			this.$(this.wrapperClass).off(`click.${this.id}`);
		}
	}
);
