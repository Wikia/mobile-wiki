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

		mrequire.entries['mercury/modules/VideoPlayers/Base'].callback(baseExports, loadStub);
		mrequire.entries['mercury/modules/VideoPlayers/Ooyala'].callback(exports, baseExports.default);

		OoyalaPlayer = exports.default;
	});

	QUnit.test('resourceURI is set', function () {
		var instance = getInstance();

		ok(instance.resourceURI.length > 0);
		equal(instance.resourceURI, 'foo');
	});

	QUnit.test('containerId is set', function () {
		ok(getInstance().containerId.match('testId'));
	});
});
