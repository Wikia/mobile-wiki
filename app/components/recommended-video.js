import Component from '@ember/component';
import NoScrollMixin from '../mixins/no-scroll';
import jwPlayerAssets from '../modules/jwplayer-assets';
import {track} from '../utils/track';
import config from '../config/environment';

export default Component.extend(NoScrollMixin, {
	classNames: ['recommended-video'],
	classNameBindings: ['isExtended', 'isReady', 'isClosed'],
	jwVideoDataUrl: 'https://cdn.jwplayer.com/v2/playlists/',
	playlistItem: null,
	playlistItems: null,

	init() {
		this._super(...arguments);

		Promise.all([
			jwPlayerAssets.load(),
			this.getVideoData()
		]).then(([, videoData]) => {
			this.set('playlistItems', videoData.playlist);
			this.set('playlistItem', videoData.playlist[0]);
			window.wikiaJWPlayer(
				'recommended-video-player',
				this.getPlayerSetup(videoData),
				this.playerCreated.bind(this)
			);
		});
	},

	actions: {
		play(index) {
			this.get('playerInstance').playlistItem(index);
		},

		close() {
			this.set('isClosed', true);
			this.set('noScroll', false);
		}
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

		playerInstance.on('playlistItem', ({item}) => {
			this.set('playlistItem', item);
		});

		this.set('isReady', true);
		this.set('playerInstance', playerInstance);
	},

	getPlayerSetup(jwVideoData) {
		return {
			autoplay: true,
			tracking: {
				category: 'recommended-video',
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
			},
			related: false,
			playerURL: 'https://content.jwplatform.com/libraries/h6Nc84Oe.js'
		};
	},

	getVideoData() {
		return fetch(`${this.jwVideoDataUrl}${this.get('playlistId')}`).then((response) => response.json());
	},

	extendView() {

	}
});
