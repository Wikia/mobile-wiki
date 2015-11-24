/* global Em, _qevents, resetMercuryBaseline */
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
	var QuantserveModule = {};
	require.entries['mercury/modules/Trackers/Quantserve'].callback(QuantserveModule, null);
	equal(typeof QuantserveModule.default, 'function');
});

QUnit.test('Track page view', function () {
	var QuantserveModule = {},
		qevents = [{
			qacct: M.prop('tracking.quantserve'),
			labels: 'tv,Category.MobileWeb.Mercury'
		}],
		tracker;

	require.entries['mercury/modules/Trackers/Quantserve'].callback(QuantserveModule, null);
	tracker = new QuantserveModule.default();

	tracker.appendScript = function () {};

	tracker.trackPageView();
	equal(window._qevents[0].qacct, qevents[0].qacct);
	equal(window._qevents[0].labels, qevents[0].labels);
});
