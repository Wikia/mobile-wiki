import {inject as service} from '@ember/service';
import Component from '@ember/component';
import {run} from '@ember/runloop';
import NoScrollMixin from '../mixins/no-scroll';
import jwPlayerAssets from '../modules/jwplayer-assets';
import {track, trackActions} from '../utils/track';
import extend from '../utils/extend';

export default Component.extend(NoScrollMixin, {
	logger: service(),

	classNames: ['recommended-video'],
	classNameBindings: ['isExtended', 'isReady', 'isClosed', 'isClickToPlay'],

	playlistItem: null,
	playlistItems: null,
	isClickToPlay: true,

	init() {
		this._super(...arguments);

		run.later(() => {
			track({
				category: 'related-video-module',
				label: 'reveal-point',
				action: trackActions.impression,
			});

			// Uncomment after XW-4771 test is done
			// this.initRecommendedVideo();
		}, 3000);
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
		play(index = 0) {
			this.get('playerInstance').playlistItem(index);

			track({
				category: 'related-video-module',
				label: 'playlist-item',
				action: trackActions.click,
			});
		},

		close() {
			this.setProperties({
				isClosed: true,
				noScroll: false
			});
			this.get('playerInstance').remove();

			track({
				category: 'related-video-module',
				label: 'close',
				action: trackActions.click,
			});
		}
	},

	initRecommendedVideo() {
		Promise.all([
			this.getVideoData(),
			jwPlayerAssets.load()
		]).then(([videoData]) => {
			if (!this.get('isDestroyed')) {
				const shuffledPlaylist = videoData.playlist.sort(() => 0.5 - Math.random());
				videoData.playlist = shuffledPlaylist.slice(0, 5);
				this.setProperties({
					playlistItems: videoData.playlist,
					playlistItem: videoData.playlist[0]
				});
				window.wikiaJWPlayer(
					'recommended-video-player',
					this.getPlayerSetup(videoData),
					this.playerCreated.bind(this)
				);
			}
		});

		track({
			category: 'related-video-module',
			label: 'revealed',
			action: trackActions.view,
		});
	},

	playerCreated(playerInstance) {
		playerInstance.once('mute', () => {
			this.expandPlayer(playerInstance);
		});

		playerInstance.on('play', (data) => {
			if (data.playReason === 'interaction') {
				playerInstance.setMute(false);
				this.expandPlayer(playerInstance);
			}
		});

		playerInstance.on('playlistItem', ({item}) => {
			// we have to clone item because Ember change it to Ember Object and it caused exception
			// when jwplayer try to set property on this object without using ember setter
			this.set('playlistItem', extend({}, item));

			track({
				category: 'related-video-module',
				label: 'playlist-item-start',
				action: trackActions.view,
			});
		});

		playerInstance.once('ready', () => {
			this.set('isReady', true);
		});

		this.set('playerInstance', playerInstance);
	},

	getPlayerSetup(jwVideoData) {
		return {
			autoplay: this.getABTestVariation(),
			tracking: {
				category: 'related-video-module',
				track(data) {
					data.trackingMethod = 'both';

					track(data);
				},
			},
			showSmallPlayerControls: true,
			videoDetails: {
				playlist: jwVideoData.playlist
			},
			playerURL: 'https://content.jwplatform.com/libraries/h6Nc84Oe.js',
			repeat: true
		};
	},

	getVideoData() {
		/* eslint-disable-next-line max-len */
		const url = `https://cdn.jwplayer.com/v2/playlists/${this.get('playlistId')}?related_media_id=${this.get('relatedMediaId')}`;

		return fetch(url).then((response) => response.json());
	},

	expandPlayer(playerInstance) {
		this.setProperties({
			isExtended: true,
			noScroll: true,
			isClickToPlay: false,
		});

		playerInstance.getContainer().classList.remove('wikia-jw-small-player-controls');

		track({
			category: 'related-video-module',
			label: 'expanded',
			action: trackActions.view,
		});
	},

	getABTestVariation() {
		return !this.get('isClickToPlay');
	}
});
