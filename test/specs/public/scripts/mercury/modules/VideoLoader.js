QUnit.module('VideoLoader tests', {
	setup: function () {
		window.$script = function () {};
		this.ele = document.createElement('div');
		this.instance = new Mercury.Modules.VideoLoader(this.ele, {
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

QUnit.test('VideoLoader should have loaded the correct player class', function () {
	expect(3);
	equal(this.instance.player.provider, 'youtube');

	this.instance.data.provider = 'ooyala';
	this.instance.loadPlayerClass();
	equal(this.instance.player.provider, 'ooyala');

	this.instance.data.provider = 'realgravity';
	this.instance.loadPlayerClass();
	equal(this.instance.player, null, 'Player is not loaded for unsupported classes');
});
