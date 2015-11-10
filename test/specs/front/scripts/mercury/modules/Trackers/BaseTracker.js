/* global Mercury */
var scriptsArray = [];

QUnit.module('BaseTracker tests', {
	setup: function () {
		var nodeElementMock = {
			parentNode: {
				insertBefore: function(element) {
					scriptsArray.push(element)
				}
			}
		};

		this.createElementOriginal = document.createElement;

		document.createElement = function() {
			return nodeElementMock;
		};

		//assign value script
		Mercury.Modules.Trackers.BaseTracker.script = nodeElementMock;
	},
	teardown: function() {
		document.createElement = this.createElementOriginal;
	}
});

QUnit.test('Append script', function () {
	var tracker = new Mercury.Modules.Trackers.BaseTracker(),
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

