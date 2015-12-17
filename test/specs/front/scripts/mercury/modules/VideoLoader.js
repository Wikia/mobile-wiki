QUnit.module('mercury/modules/VideoLoader', function (hooks) {
	var VideoLoader,
		getInstance = function (params) {
			return new VideoLoader(params);
		};

	hooks.beforeEach(function () {
		var exports = {};

		mrequire.entries['mercury/modules/VideoLoader'].callback(exports, {
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

	QUnit.test('VideoLoader can tell if a provider is Ooyala or not', function () {
		var instance = getInstance({
			provider: 'ooyala/funimation'
		});
		ok(instance.isProvider('ooyala'));

		instance = getInstance({
			provider: 'OOYALA'
		});
		ok(instance.isProvider('ooyala'));

		instance = getInstance({
			provider: 'OoYaLa/randooom'
		});
		ok(instance.isProvider('ooyala'));


		instance = getInstance({
			provider: 'youtube'
		});
		equal(instance.isProvider('ooyala'), false);
	});

	QUnit.test('VideoLoader can tell which provider is using', function () {
		var instance = getInstance({
			provider: 'ooyala/funimation'
		});
		equal(instance.getProviderName(), 'ooyala');

		instance = getInstance({
			provider: 'OOYALA'
		});
		equal(instance.getProviderName(), 'ooyala');

		instance = getInstance({
			provider: 'OoYaLa/randooom'
		});
		equal(instance.getProviderName(), 'ooyala');

		instance = getInstance({
			provider: 'youtube'
		});
		equal(instance.getProviderName(), 'youtube');
	});

	QUnit.test('getPlayerClassBasedOnProvider returns correct player class', function () {
		equal(VideoLoader.getPlayerClassBasedOnProvider('ooyala').className, 'OoyalaPlayer');
		equal(VideoLoader.getPlayerClassBasedOnProvider('realgravity').className, 'BasePlayer');
	});
});
