import {inject as service} from '@ember/service';
import Component from '@ember/component';
import {run} from '@ember/runloop';
import NoScrollMixin from '../mixins/no-scroll';
import jwPlayerAssets from '../modules/jwplayer-assets';
import {track} from '../utils/track';
import extend from '../utils/extend';

export default Component.extend(NoScrollMixin, {
	logger: service(),

	classNames: ['recommended-video'],
	classNameBindings: ['isExtended', 'isReady', 'isClosed'],

	playlistItem: null,
	playlistItems: null,

	init() {
		this._super(...arguments);

		run.later(() => {
			this.initRecommendedVideo();
		}, 5000);
	},

	willDestroyElement() {
		const player = this.get('playerInstance');
		if (player) {
			try {
				player.remove();
			} catch (e) {
				this.get('logger').warn(e);
			}
		}
	},

	actions: {
		play(index) {
			this.get('playerInstance').playlistItem(index);
		},

		close() {
			this.setProperties({
				isClosed: true,
				noScroll: false
			});
			this.get('playerInstance').remove();
		}
	},

	initRecommendedVideo() {
		Promise.all([
			jwPlayerAssets.load(),
			this.getVideoData()
		]).then(([, videoData]) => {
			this.setProperties({
				playlistItems: videoData.playlist,
				playlistItem: videoData.playlist[0]
			});
			window.wikiaJWPlayer(
				'recommended-video-player',
				this.getPlayerSetup(videoData),
				this.playerCreated.bind(this)
			);
		});
	},

	playerCreated(playerInstance) {
		playerInstance.once('mute', () => {
			this.setProperties({
				isExtended: true,
				noScroll: true
			});
		});

		playerInstance.on('playlistItem', ({item}) => {
			// we have to clone item because Ember change it to Ember Object and it caused exception
			// when jwplayer try to set property on this object without using ember setter
			this.set('playlistItem', extend({}, item));
		});

		playerInstance.once('ready', () => {
			this.set('isReady', true);
		});

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
			showSmallPlayerControls: true,
			videoDetails: {
				playlist: jwVideoData.playlist
			},
			playerURL: 'https://content.jwplatform.com/libraries/h6Nc84Oe.js'
		};
	},

	getVideoData() {
		return fetch(`https://cdn.jwplayer.com/v2/playlists/${this.get('playlistId')}`).then((response) => response.json());
	}
});
