/* global Mercury */
QUnit.module('mercury/modules/Trackers/BaseTracker', function (hooks) {
	var scriptsArray = [],
		BaseTracker;

	hooks.beforeEach(function () {
		var nodeElementMock = {
				parentNode: {
					insertBefore: function (element) {
						scriptsArray.push(element)
					}
				}
			},
			exports = {};

		this.createElementOriginal = document.createElement;

		document.createElement = function () {
			return nodeElementMock;
		};

		mrequire.entries['mercury/modules/Trackers/BaseTracker'].callback(exports);
		BaseTracker = exports.default;
		BaseTracker.script = nodeElementMock;
	});

	hooks.afterEach(function () {
		document.createElement = this.createElementOriginal;
		scriptsArray = [];
	});

	QUnit.test('Append script', function () {
		var tracker = new BaseTracker(),
			scriptsCountBeforeAppend = 0,
			scriptsCountAfterAppend,
			insertedScriptNode;

		tracker.url = function () {
			return 'scriptUrl';
		};

		tracker.appendScript();

		scriptsCountAfterAppend = scriptsArray.length;
		insertedScriptNode = scriptsArray[0];

		equal(scriptsCountAfterAppend - scriptsCountBeforeAppend, 1, 'Script is appended to document');
		equal(insertedScriptNode['async'], true, 'Script is marked as async');
		equal(insertedScriptNode['src'], 'scriptUrl', 'Script has correct url');
	});
});
