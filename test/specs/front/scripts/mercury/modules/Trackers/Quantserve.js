/* global Em, _qevents */
QUnit.module('Quantserve tests', {
	setup: function () {
		Mercury.tracking = {
			quantserve: '1234'
		};

		Mercury.wiki = {
			vertical: 'tv'
		};
	}
});

QUnit.test('Quantserve is compiled into Mercury.Modules.Trackers namespace', function () {
	equal(typeof Mercury.Modules.Trackers.Quantserve, 'function');
});

QUnit.test('Track page view', function () {
	var tracker = new Mercury.Modules.Trackers.Quantserve(),
		qevents = [{
			qacct: Mercury.tracking.quantserve,
			labels: 'tv,Category.MobileWeb.Mercury'
		}];

	tracker.appendScript = function () {};

	tracker.trackPageView();
	equal(window._qevents[0].qacct, qevents[0].qacct);
	equal(window._qevents[0].labels, qevents[0].labels);
});
