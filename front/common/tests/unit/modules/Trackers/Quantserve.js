/* global Em, _qevents */
QUnit.module('Quantserve tests', function (hooks) {
	var Quantserve,
		originalMercuryWiki;

	hooks.beforeEach(function () {
		var exports = {};

		mrequire.entries['mercury/modules/Trackers/Quantserve'].callback(exports, null);

		Quantserve = exports.default;

		// instantiate with mutation because multiple test runs
		M.prop('tracking.quantserve', '1234', true);

		originalMercuryWiki = Mercury.wiki;
		Mercury.wiki = {
			vertical: 'tv'
		};
	});

	hooks.afterEach(function () {
		Mercury.wiki = originalMercuryWiki;
	});

	QUnit.test('Quantserve is compiled', function () {
		equal(typeof Quantserve, 'function');
	});

	QUnit.test('Track page view', function () {
		var qevents = [{
				qacct: M.prop('tracking.quantserve'),
				labels: 'tv,Category.MobileWeb.Mercury'
			}],
			tracker;

		tracker = new Quantserve();

		tracker.appendScript = sinon.stub();

		tracker.trackPageView();
		equal(window._qevents[0].qacct, qevents[0].qacct);
		equal(window._qevents[0].labels, qevents[0].labels);
	});
});
