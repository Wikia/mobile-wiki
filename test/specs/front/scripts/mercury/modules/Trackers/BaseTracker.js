/* global Mercury */
QUnit.module('BaseTracker tests', {
	setup: function () {
		document.write(
			'<div id="first"><script id="foo"></script></div><div id="second"><script id="bar"></script></div>'
		);
		//assign value script
		Mercury.Modules.Trackers.BaseTracker.script = document.getElementById('foo');
	}
});

QUnit.test('Append script', function () {
	var tracker = new Mercury.Modules.Trackers.BaseTracker(),
		scriptsCountBeforeAppend = document.querySelectorAll('script').length,
		scriptsCountAfterAppend,
		insertedScriptNode;

	tracker.url = function() {return 'scriptUrl'};

	tracker.appendScript();

	scriptsCountAfterAppend = document.querySelectorAll('script').length;
	insertedScriptNode = document.querySelector('script[src="scriptUrl"]');

	equal(scriptsCountAfterAppend - scriptsCountBeforeAppend, 1, 'Script is appended to document');
	equal(Mercury.Modules.Trackers.BaseTracker.script.previousSibling, insertedScriptNode, 'Script is inserted before');
	equal(insertedScriptNode.hasAttribute('async'), true, 'Script is marked as async');
});

