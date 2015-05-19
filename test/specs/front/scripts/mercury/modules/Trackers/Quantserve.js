/* global Em, _qevents */
QUnit.module('Quantserve tests', {
	setup: function () {

		// instantiate with mutation because multiple test runs
		M.prop('tracking.quantserve', '1234', true);

		Mercury.wiki = {
			vertical: 'tv'
		};
	},
	teardown: function () {
		resetMercuryBaseline();
	}
});

QUnit.test('Quantserve is compiled into Mercury.Modules.Trackers namespace', function () {
	equal(typeof Mercury.Modules.Trackers.Quantserve, 'function');
});

QUnit.test('Track page view', function () {
	var tracker = new Mercury.Modules.Trackers.Quantserve(),
		qevents = [{
			qacct: M.prop('tracking.quantserve'),
			labels: 'tv,Category.MobileWeb.Mercury'
		}];

	tracker.appendScript = function () {};

	tracker.trackPageView();
	equal(window._qevents[0].qacct, qevents[0].qacct);
	equal(window._qevents[0].labels, qevents[0].labels);
});
