QUnit.module('VideoPlayers.OoyalaPlayer', {
	setup: function () {
		var params = {
			videoId: 666,
			jsFile: ['foo'],
			playerId: 'testId'
		};
		this.player = new Wikia.Modules.VideoPlayers.OoyalaPlayer('ooyala', params);
	},
	teardown: function () {
	}
});

QUnit.test('resourceURI is set', function () {
	ok(this.player.resourceURI.length > 0);
	equal(this.player.resourceURI, 'foo');
});

QUnit.test('containerId is set', function () {
	ok(this.player.containerId.match('testId'));
});

