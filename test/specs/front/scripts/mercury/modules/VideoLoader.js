QUnit.module('VideoLoader tests', {
	setup: function () {
		window.$script = function () {};
		this.instance = new Mercury.Modules.VideoLoader({
				provider: 'youtube',
				jsParams: {
					videoId: 666,
					jsFile: ['foo']
				}
			});
	},
	teardown: function () {
	}
});

QUnit.test('VideoLoader is compiled into Mercury.Modules namespace', function () {
	expect(2);
	ok(Mercury.Modules.VideoLoader);
	equal(typeof Mercury.Modules.VideoLoader, 'function');
});

QUnit.test('VideoLoader can tell if a provider is Ooyala or not', function () {
	expect(4);

	this.instance.data.provider = 'ooyala/funimation';
	ok(this.instance.isProvider('ooyala'));

	this.instance.data.provider = 'OOYALA';
	ok(this.instance.isProvider('ooyala'));

	this.instance.data.provider = 'OoYaLa/randooom';
	ok(this.instance.isProvider('ooyala'));

	this.instance.data.provider = 'youtube';
	equal(this.instance.isProvider('ooyala'), false);
});

QUnit.test('VideoLoader can tell which provider is using', function () {
	expect(4);

	this.instance.data.provider = 'ooyala/funimation';
	equal(this.instance.getProviderName(), 'ooyala');

	this.instance.data.provider = 'OOYALA';
	equal(this.instance.getProviderName(), 'ooyala');

	this.instance.data.provider = 'OoYaLa/randooom';
	equal(this.instance.getProviderName(), 'ooyala');

	this.instance.data.provider = 'youtube';
	equal(this.instance.getProviderName(), 'youtube');
});

QUnit.test('VideoLoader should have loaded the correct player class', function () {
	equal(this.instance.player.provider, 'youtube');

	this.instance.data.provider = 'ooyala';
	this.instance.loadPlayerClass();
	equal(this.instance.player.provider, 'ooyala');

	//Should load base player for unsupported classes
	this.instance.data.provider = 'realgravity';
	this.instance.loadPlayerClass();
	equal(this.instance.player.provider, 'realgravity');
	equal(this.instance.player instanceof Mercury.Modules.VideoPlayers.BasePlayer, true);

});
