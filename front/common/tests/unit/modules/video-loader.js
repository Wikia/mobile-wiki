QUnit.module('common/modules/video-loader', function (hooks) {
	var VideoLoader,
		getInstance = function (params) {
			return new VideoLoader(params);
		};

	hooks.beforeEach(function () {
		var exports = {};

		require.entries['common/modules/video-loader'].callback(exports, {
			className: 'BasePlayer'
		}, {
			className: 'OoyalaPlayer'
		}, {
			className: 'YoutubePlayer'
		});

		VideoLoader = exports.default;
		VideoLoader.createPlayer = sinon.stub().returns({
			onResize: sinon.stub(),
			setupPlayer: sinon.stub()
		});
	});

	QUnit.test('VideoLoader can tell if a provider is Ooyala or not', function (assert) {
		var instance = getInstance({
			provider: 'ooyala/funimation'
		});

		assert.ok(instance.isProvider('ooyala'));

		instance = getInstance({
			provider: 'OOYALA'
		});
		assert.ok(instance.isProvider('ooyala'));

		instance = getInstance({
			provider: 'OoYaLa/randooom'
		});
		assert.ok(instance.isProvider('ooyala'));


		instance = getInstance({
			provider: 'youtube'
		});
		assert.equal(instance.isProvider('ooyala'), false);
	});

	QUnit.test('VideoLoader can tell which provider is using', function (assert) {
		var instance = getInstance({
			provider: 'ooyala/funimation'
		});

		assert.equal(instance.getProviderName(), 'ooyala');

		instance = getInstance({
			provider: 'OOYALA'
		});
		assert.equal(instance.getProviderName(), 'ooyala');

		instance = getInstance({
			provider: 'OoYaLa/randooom'
		});
		assert.equal(instance.getProviderName(), 'ooyala');

		instance = getInstance({
			provider: 'youtube'
		});
		assert.equal(instance.getProviderName(), 'youtube');
	});

	QUnit.test('getPlayerClassBasedOnProvider returns correct player class', function (assert) {
		assert.equal(VideoLoader.getPlayerClassBasedOnProvider('ooyala').className, 'OoyalaPlayer');
		assert.equal(VideoLoader.getPlayerClassBasedOnProvider('realgravity').className, 'BasePlayer');
	});
});
