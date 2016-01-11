QUnit.module('mercury/modules/VideoPlayers/Ooyala', function (hooks) {
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
			baseExports = {},
			exports = {};

		require.entries['common/modules/VideoPlayers/Base'].callback(baseExports, loadStub);
		require.entries['common/modules/VideoPlayers/Ooyala'].callback(exports, baseExports.default);

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
