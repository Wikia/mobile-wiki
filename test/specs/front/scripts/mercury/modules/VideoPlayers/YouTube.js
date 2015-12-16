QUnit.module('mercury/modules/VideoPlayers/YouTube', function (hooks) {
	var YouTubePlayer,
		getInstance = function () {
			var instance = new YouTubePlayer('youtube', {
				videoId: 666,
				size: {
					width: 100,
					height: 100
				}
			});

			instance.createPlayer = sinon.stub();

			return instance;
		};

	hooks.beforeEach(function () {
		var loadStub = sinon.stub().callsArg(1),
			baseExports = {},
			exports = {};

		mrequire.entries['mercury/modules/VideoPlayers/Base'].callback(baseExports, loadStub);
		mrequire.entries['mercury/modules/VideoPlayers/YouTube'].callback(exports, baseExports.default);

		YouTubePlayer = exports.default;
	});

	QUnit.test('resourceURI is set', function () {
		var instance = getInstance();

		ok(instance.resourceURI.length > 0);
		equal(instance.resourceURI, 'https://www.youtube.com/iframe_api');
	});

	QUnit.test('containerId is set', function () {
		ok(getInstance().containerId.match('youtubeVideoPlayer'));
	});
});
