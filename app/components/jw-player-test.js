import Ember from 'ember';
import fetch from 'ember-network/fetch';

const {Component} = Ember;

export default Component.extend({
	player: null,

	init() {
		this._super(...arguments);

		fetch('https://cdn.jwplayer.com/v2/media/FYykS9se?format=json&poster_width=720')
			.then((response) => {
				return response.json();
			})
			.then((data) => {
				const videoData = data.playlist[0];

				if (this.get('isDestroyed')) {
					return;
				}

				this.setProperties({
					title: videoData.title,
					image: videoData.image
				});
			})
			.catch((error) => {
				console.error(error);
			});
	},

	didInsertElement() {
		$script('http://content.jwplatform.com/libraries/S2xWVQ9r.js', () => {
			const player = window.jwplayer('jwplayer-container');

			this.set('player', player);
			player.setup({
				autostart: true,
				aspectratio: '16:9',
				file: '//content.jwplatform.com/videos/FYykS9se-xhZUqUI6.mp4',
				mute: false,
				related: {
					autoplaytimer: 10,
					file: 'https://cdn.jwplayer.com/v2/playlists/Y2RWCKuS?related_media_id=FYykS9se',
					heading: 'Recommended',
					oncomplete: 'autoplay'
				},
				width: '100%'
			});
		});
	}
});
