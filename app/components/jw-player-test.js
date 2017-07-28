import Ember from 'ember';

const {Component} = Ember;

export default Component.extend({
	didInsertElement() {
		$script('http://content.jwplatform.com/libraries/S2xWVQ9r.js', () => {
			window.jwplayer('jwplayer-container').setup({
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
