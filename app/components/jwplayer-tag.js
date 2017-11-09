import Ember from 'ember';
import jwPlayerAssets from '../modules/jwplayer-assets';

const {RSVP, $, computed, Component} = Ember;

export default Component.extend({
	jwVideoDataUrl: 'https://cdn.jwplayer.com/v2/media/',

	jwPlayerRootId: computed('media-id', function () {
		return `jwPlayerTag${this.get('media-id')}`;
	}),

	/**
	 * @returns {void}
	 */
	didInsertElement() {
		RSVP.Promise.all([
			jwPlayerAssets.load(),
			this.getVideoData()
		]).then(([, videoData]) => {
			window.wikiaJWPlayer(
				this.get('jwPlayerRootId'),
				this.getPlayerSetup(videoData)
			);
		});
	},

	getPlayerSetup(jwVideoData) {
		return {
			autoplay: {
				enabled: false
			},
			videoDetails: {
				description: jwVideoData.description,
				title: jwVideoData.title,
				playlist: jwVideoData.playlist
			}
		};
	},

	getVideoData() {
		return $.get(`${this.jwVideoDataUrl}${this.get('media-id')}`);
	}
});
