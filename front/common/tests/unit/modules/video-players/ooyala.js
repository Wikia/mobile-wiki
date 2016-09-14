QUnit.module('mercury/modules/video-players/ooyala', function (hooks) {
	var OoyalaPlayer,
		getInstance = function () {
			var instance = new OoyalaPlayer('ooyala', {
				videoId: 666,
				jsFile: ['foo'],
				playerId: 'testId',
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
			adsExports = {},
			baseExports = {},
			exports = {};

		require.entries['common/modules/ads'].callback(adsExports, loadStub);
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
});
