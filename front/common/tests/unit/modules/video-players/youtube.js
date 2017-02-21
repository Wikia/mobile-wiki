QUnit.module('common/modules/video-players/youtube', function (hooks) {
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

		require.entries['common/modules/video-players/base'].callback(baseExports, loadStub);
		require.entries['common/modules/video-players/youtube'].callback(exports, baseExports.default);

		YouTubePlayer = exports.default;
	});

	QUnit.test('resourceURI is set', function (assert) {
		var instance = getInstance();

		assert.ok(instance.resourceURI.length > 0);
		assert.equal(instance.resourceURI, 'https://www.youtube.com/iframe_api');
	});

	QUnit.test('containerId is set', function (assert) {
		assert.ok(getInstance().containerId.match('youtubeVideoPlayer'));
	});
});
