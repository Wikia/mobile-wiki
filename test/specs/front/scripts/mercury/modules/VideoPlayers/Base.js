QUnit.module('mercury/modules/VideoPlayers/Base', function (hooks) {
	var BasePlayer,
		loadStub = sinon.stub().callsArg(1),
		trackStub = sinon.stub(),
		getInstance = function () {
			return new BasePlayer('base', {
				videoId: 666,
				size: {
					width: 100,
					height: 100
				}
			});
		};

	hooks.beforeEach(function () {
		var exports = {};

		mrequire.entries['mercury/modules/VideoPlayers/Base'].callback(exports, loadStub, {}, {
			track: trackStub
		});

		BasePlayer = exports.default;
		BasePlayer.createPlayer = sinon.stub().returns({
			onResize: sinon.stub()
		});
	});

	hooks.afterEach(function () {
		loadStub.reset();
		trackStub.reset();
	});

	QUnit.test('Player requires a provider', function () {
		var error = new Error('VideoPlayer requires a provider as the first argument');

		throws(function () {
			new BasePlayer();
		}, error);
	});

	QUnit.test('loadPlayer calls M.load and playerDidLoad hook', function () {
		var instance = getInstance();

		this.spy(instance, 'playerDidLoad');

		equal(instance.playerDidLoad.called, false, 'playerDidLoad should not be called yet');

		instance.loadPlayer();

		ok(loadStub.calledOnce, 'load was called');
		ok(instance.playerDidLoad.calledOnce, 'the playerDidLoad hook fired appropriately');
	});

	QUnit.test('createUniqueId', function () {
		var ele = document.createElement('div'),
			id = 'videoPlayerTest',
			newId;

		ele.id = id;
		newId = BasePlayer.createUniqueId(id);
		document.body.appendChild(ele);

		equal(typeof parseInt(newId.slice(id.length), 10), 'number', 'Appends a UNIX timestamp');
		ok(newId.length === id.length + 13, 'Appends a UNIX timestamp');
	});

	QUnit.test('local track calls M.track with extended params', function () {
		getInstance().track('view', 'player-loaded');

		ok(trackStub.calledOnce, 'track called once');
		ok(trackStub.calledWith({
			action: 'view',
			category: 'video-player-player-loaded',
			label: 'base'
		}), 'track called with correct params');
	});
});
