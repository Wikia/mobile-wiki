import {inject as service} from '@ember/service';
import Component from '@ember/component';
import {run} from '@ember/runloop';
import NoScrollMixin from '../mixins/no-scroll';
import jwPlayerAssets from '../modules/jwplayer-assets';
import {track, trackActions} from '../utils/track';
import extend from '../utils/extend';
import {inGroup} from '../modules/abtest';

export default Component.extend(NoScrollMixin, {
	logger: service(),

	classNames: ['recommended-video'],
	classNameBindings: ['isExtended', 'isReady', 'isClosed', 'isClickToPlay'],

	playlistItem: null,
	playlistItems: null,
	isClickToPlay: true,
	isInitialPlay: true,

	init() {
		this._super(...arguments);
		this.setup = this.setup.bind(this);
	},

	didInsertElement() {
		window.onABTestLoaded(this.setup);
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

	setup() {
		run.later(() => {
			track({
				category: 'related-video-module',
				label: 'reveal-point',
				action: trackActions.impression,
			});

			const isClickToPlay = inGroup('RECOMMENDED_VIDEO_AB', 'CLICK_TO_PLAY');
			const isAutoPlay = inGroup('RECOMMENDED_VIDEO_AB', 'AUTOPLAY');

			this.set('isClickToPlay', isClickToPlay);

			if (isAutoPlay || isClickToPlay) {
				this.initRecommendedVideo();
			}
		}, 3000);
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
		if (!this.get('isClickToPlay')) {
			playerInstance.once('mute', () => {
				if (!this.get('isExtended')) {
					this.expandPlayer(playerInstance);
				}
			});
		}

		playerInstance.on('play', (data) => {
			if (data.playReason === 'interaction' && !this.get('isExtended')) {
				playerInstance.setMute(false);
				this.expandPlayer(playerInstance);
			}
		});

		playerInstance.on('playlistItem', ({item}) => {
			// we have to clone item because Ember change it to Ember Object and it caused exception
			// when jwplayer try to set property on this object without using ember setter
			this.set('playlistItem', extend({}, item));

			// We need this to not track first playlist-item-start when player is folded in click-to-play
			if (!this.get('isClickToPlay') || !this.get('isInitialPlay')) {
				track({
					category: 'related-video-module',
					label: 'playlist-item-start',
					action: trackActions.view,
				});
			}
		});

		playerInstance.once('ready', () => {
			this.set('isReady', true);
		});

		this.set('playerInstance', playerInstance);
	},

	getPlayerSetup(jwVideoData) {
		return {
			autoplay: this.getABTestVariation(),
			mute: true,
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
		return fetch(`https://cdn.jwplayer.com/v2/playlists/${this.get('playlistId')}?related_media_id=${this.get('relatedMediaId')}`).then((response) => response.json());
	},

	expandPlayer(playerInstance) {
		if (this.get('isClickToPlay') && this.get('isInitialPlay')) {
			this.set('isInitialPlay', false);

			if (this.get('isClickToPlay')) {
				track({
					category: 'related-video-module',
					label: 'playlist-item-start',
					action: trackActions.view,
				});
			}
		}

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
