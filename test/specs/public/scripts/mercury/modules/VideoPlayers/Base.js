QUnit.module('VideoPlayers.BasePlayer', {
	setup: function () {
		var params = {
			videoId: 666,
			size: {
				width: 100,
				height: 100
			}
		};
		this.player = new Mercury.Modules.VideoPlayers.BasePlayer('base', params);
	},
	teardown: function () {
	}
});

QUnit.test('Player requires a provider', function () {
	var error = new Error('VideoPlayer requires a provider as the first argument');
	throws(Mercury.Modules.VideoPlayers.BasePlayer, error);
});

QUnit.test('loadPlayer calls M.load and playerDidLoad hook', function () {
	expect(3);

	var stub = this.stub(M, 'load');
	stub.callsArg(1);
	this.spy(this.player, 'playerDidLoad');

	equal(this.player.playerDidLoad.calledOnce, false, 'playerDidLoad.calledOnce should start at false');

	this.player.loadPlayer();

	ok(M.load.calledOnce, 'M.load was called');
	ok(this.player.playerDidLoad.calledOnce, 'the playerDidLoad hook fired appropriately');
});

QUnit.test('createUniqueId', function () {
	var ele = document.createElement('div'),
		id = 'videoPlayerTest',
		newId;

	ele.id = id;
	newId = this.player.createUniqueId(id);
	document.body.appendChild(ele);

	equal(typeof parseInt(newId.slice(id.length), 10), 'number', 'Appends a UNIX timestamp');
	ok(newId.length === id.length + 13, 'Appends a UNIX timestamp');
});

QUnit.test('local track calls M.track with extended params', function () {
	this.stub(M, 'track', function (evt) {
		equal(evt.category, 'video-player-bar');
	});

	this.player.track('bar');
	ok(M.track.calledOnce);
});

