QUnit.module('VideoPlayers.YouTubePlayer', {
	setup: function () {
		var params = {
			videoId: 666,
			size: {
				width: 100,
				height: 100
			}
		};
		this.player = new Mercury.Modules.VideoPlayers.YouTubePlayer('youtube', params);
	},
	teardown: function () {
	}
});

QUnit.test('resourceURI is set', function () {
	ok(this.player.resourceURI.length > 0);
	equal(this.player.resourceURI, 'https://www.youtube.com/iframe_api');
});

QUnit.test('containerId is set', function () {
	ok(this.player.containerId.match('youtubeVideoPlayer'));
});

