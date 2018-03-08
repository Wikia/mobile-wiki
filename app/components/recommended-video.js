import Component from '@ember/component';
import NoScrollMixin from '../mixins/no-scroll';
import jwPlayerAssets from '../modules/jwplayer-assets';
import {track} from '../utils/track';
import config from '../config/environment';

export default Component.extend(NoScrollMixin, {
	classNames: ['recommended-video'],
	classNameBindings: ['isExtended'],
	jwVideoDataUrl: 'https://cdn.jwplayer.com/v2/media/',
	'media-id': 'FYykS9se',

	/**
	 * @returns {void}
	 */
	didInsertElement() {
		this._super(...arguments);

		Promise.all([
			jwPlayerAssets.load(),
			this.getVideoData()
		]).then(([, videoData]) => {
			window.wikiaJWPlayer(
				'recommended-video-player',
				this.getPlayerSetup(videoData),
				this.playerCreated.bind(this)
			);
		});
	},

	playerCreated(playerInstance) {
		playerInstance.on('captionsSelected', ({selectedLang}) => {
			window.Cookies.set(this.get('captionsCookieName'), selectedLang, {
				expires: this.get('playerCookieExpireDays'),
				path: '/',
				domain: config.cookieDomain
			});
		});

		playerInstance.once('mute', () => {
			this.set('isExtended', true);
			this.set('noScroll', true);
		});
	},

	getPlayerSetup(jwVideoData) {
		return {
			autoplay: true,
			tracking: {
				category: 'in-article-video',
				track(data) {
					data.trackingMethod = 'both';

					track(data);
				},
			},
			selectedCaptionsLanguage: window.Cookies.get(this.get('captionsCookieName')),
			settings: {
				showCaptions: true
			},
			videoDetails: {
				description: jwVideoData.description,
				title: jwVideoData.title,
				playlist: jwVideoData.playlist
			}
		};
	},

	getVideoData() {
		return fetch(`${this.jwVideoDataUrl}${this.get('media-id')}`).then((response) => response.json());
	},

	extendView() {

	}
});
