QUnit.module('mercury/modules/VideoLoader', {
	setup: function () {
		var exports = {},
			VideoLoader;

		require.entries['mercury/modules/VideoLoader'].callback(exports, {
			className: 'BasePlayer'
		}, {
			className: 'OoyalaPlayer'
		}, {
			className: 'YoutubePlayer'
		});

		VideoLoader = exports.default;
		VideoLoader.createPlayer = sinon.stub().returns({
			onResize: sinon.stub()
		});

		this.VideoLoader = VideoLoader;
	}
});

QUnit.test('VideoLoader can tell if a provider is Ooyala or not', function () {
	var instance = new this.VideoLoader({
		provider: 'ooyala/funimation'
	});
	ok(instance.isProvider('ooyala'));

	instance = new this.VideoLoader({
		provider: 'OOYALA'
	});
	ok(instance.isProvider('ooyala'));

	instance = new this.VideoLoader({
		provider: 'OoYaLa/randooom'
	});
	ok(instance.isProvider('ooyala'));


	instance = new this.VideoLoader({
		provider: 'youtube'
	});
	equal(instance.isProvider('ooyala'), false);
});

QUnit.test('VideoLoader can tell which provider is using', function () {
	var instance = new this.VideoLoader({
		provider: 'ooyala/funimation'
	});
	equal(instance.getProviderName(), 'ooyala');

	instance = new this.VideoLoader({
		provider: 'OOYALA'
	});
	equal(instance.getProviderName(), 'ooyala');

	instance = new this.VideoLoader({
		provider: 'OoYaLa/randooom'
	});
	equal(instance.getProviderName(), 'ooyala');

	instance = new this.VideoLoader({
		provider: 'youtube'
	});
	equal(instance.getProviderName(), 'youtube');
});

QUnit.test('getPlayerClassBasedOnProvider returns correct player class', function () {
	deepEqual(this.VideoLoader.getPlayerClassBasedOnProvider('ooyala'), {
		className: 'OoyalaPlayer'
	});

	deepEqual(this.VideoLoader.getPlayerClassBasedOnProvider('realgravity'), {
		className: 'BasePlayer'
	});
});
