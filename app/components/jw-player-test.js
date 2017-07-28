import Ember from 'ember';

const {Component} = Ember;

export default Component.extend({
	didInsertElement() {
		$script('http://content.jwplatform.com/libraries/S2xWVQ9r.js', () => {
			window.jwplayer('jwplayer-container').setup({
				file: '//content.jwplatform.com/videos/FYykS9se-xhZUqUI6.mp4',
				mute: false,
				autostart: true,
				width: '100%',
				aspectratio: '16:9'
			});
		});
	}
});
