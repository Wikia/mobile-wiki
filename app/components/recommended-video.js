import {inject as service} from '@ember/service';
import Component from '@ember/component';
import NoScrollMixin from '../mixins/no-scroll';
import jwPlayerAssets from '../modules/jwplayer-assets';
import {track} from '../utils/track';

export default Component.extend(NoScrollMixin, {
	logger: service(),

	classNames: ['recommended-video'],
	classNameBindings: ['isExtended', 'isReady', 'isClosed'],

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

	playerCreated(playerInstance) {
		playerInstance.once('mute', () => {
			this.setProperties({
				isExtended: true,
				noScroll: true
			});
		});

		playerInstance.on('playlistItem', ({item}) => {
			this.set('playlistItem', item);
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
			videoDetails: {
				description: jwVideoData.description,
				title: jwVideoData.title,
				playlist: jwVideoData.playlist
			},
			playerURL: 'https://content.jwplatform.com/libraries/h6Nc84Oe.js'
		};
	},

	getVideoData() {
		return fetch(`https://cdn.jwplayer.com/v2/playlists/${this.get('playlistId')}`).then((response) => response.json());
	}
});
