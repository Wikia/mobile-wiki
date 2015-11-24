/* global Mercury */
var scriptsArray,
	baseTracker;

QUnit.module('BaseTracker tests', {
	setup: function () {
		var nodeElementMock = {
			parentNode: {
				insertBefore: function(element) {
					scriptsArray.push(element)
				}
			}
		};

		baseTracker = {};
		scriptsArray = [];
		this.createElementOriginal = document.createElement;

		document.createElement = function() {
			return nodeElementMock;
		};

		//assign value script
		require.entries['mercury/modules/Trackers/BaseTracker'].callback(baseTracker);
		baseTracker = baseTracker.default;
		baseTracker.script = nodeElementMock;
	},
	teardown: function() {
		document.createElement = this.createElementOriginal;
		scriptsArray = [];
		baseTracker = {};
	}
});

QUnit.test('Append script', function () {
	var tracker = new baseTracker(),
		scriptsCountBeforeAppend = 0,
		scriptsCountAfterAppend,
		insertedScriptNode;

	tracker.url = function() {return 'scriptUrl'};

	tracker.appendScript();

	scriptsCountAfterAppend = scriptsArray.length;
	insertedScriptNode = scriptsArray[0];

	equal(scriptsCountAfterAppend - scriptsCountBeforeAppend, 1, 'Script is appended to document');
	equal(insertedScriptNode['async'], true, 'Script is marked as async');
	equal(insertedScriptNode['src'], 'scriptUrl', 'Script has correct url');
});

