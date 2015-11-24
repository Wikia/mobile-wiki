/* global Mercury, _comscore */
QUnit.module('Comscore tests', {
	setup: function () {
		M.props({
			tracking: {
				comscore: {
					keyword: 'comscorekw',
					id: '123',
					c7: 'c7',
					c7Value: 'c7value'
				}
			}
		// initialize with mutations because tests are run multiple times
		}, true);
	}
});

QUnit.test('Comscore is compiled into Mercury.Modules.Trackers namespace', function () {
	var Comscore = {};

	require.entries['mercury/modules/Trackers/Comscore'].callback(Comscore, null);
	ok(Comscore);
	strictEqual(typeof Comscore.default, 'function');
});

QUnit.test('Track page view', function () {
	var Comscore = {},
		queue,
		tracker;

	require.entries['mercury/modules/Trackers/Comscore'].callback(Comscore, null);
	tracker = new Comscore.default();
	queue = [{
		c1: '2',
		c2: M.prop('tracking.comscore.id'),
		options: {
			url_append: M.prop('tracking.comscore.keyword') + '=' + M.prop('tracking.comscore.c7Value')
		}
	}];

	tracker.appendScript = function () {};

	tracker.trackPageView();
	deepEqual(window._comscore, queue);
});
