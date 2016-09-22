QUnit.module('mercury/modules/video-players/ooyala', function (hooks) {
	var createPlayerSpy,
		OoyalaPlayer,
		getInstance = function (params) {
			var instance;

			params = params || {};
			instance = new OoyalaPlayer('ooyala', {
				videoId: 666,
				jsFile: ['foo'],
				playerId: 'testId',
				size: {
					width: 100,
					height: 100
				},
				noAds: params.noAds
			});

			return instance;
		};

	hooks.beforeEach(function () {
		var loadStub = sinon.stub().callsArg(1),
			adsExports = {},
			baseExports = {},
			exports = {};

		createPlayerSpy = sinon.spy();
		window.OO = {
			Player: {
				create: createPlayerSpy
			}
		};

		require.entries['common/modules/ads'].callback(adsExports, loadStub);

		adsExports.default.getInstance = function () {
			return {
				onReady: function (callback, context) {
					callback.apply(context);
				},
				buildVastUrl: function () {
					return 'http://vast.url';
				}
			};
		};

		require.entries['common/modules/video-players/base'].callback(baseExports, loadStub);
		require.entries['common/modules/video-players/ooyala'].callback(
			exports, adsExports.default, baseExports.default
		);

		OoyalaPlayer = exports.default;
	});

	QUnit.test('resourceURI is set', function (assert) {
		var instance = getInstance();

		assert.ok(instance.resourceURI.length > 0);
		assert.equal(instance.resourceURI, 'foo');
	});

	QUnit.test('containerId is set', function (assert) {
		assert.ok(getInstance().containerId.match('testId'));
	});

	QUnit.test('create player with VAST url', function (assert) {
		var ooyala = getInstance();

		ooyala.createPlayer();

		assert.ok(createPlayerSpy.called);
		assert.equal(createPlayerSpy.getCall(0).args[2]['google-ima-ads-manager'].adTagUrl, 'http://vast.url');
	});

	QUnit.test('create player without VAST url when noAds is true', function (assert) {
		var ooyala = getInstance({
			noAds: true
		});

		ooyala.createPlayer();

		assert.ok(createPlayerSpy.called);
		assert.notOk(createPlayerSpy.getCall(0).args[2]['google-ima-ads-manager']);
	});
});
