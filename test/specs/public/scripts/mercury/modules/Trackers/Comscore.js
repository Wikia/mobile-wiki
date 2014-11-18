/* global Mercury, _comscore */
QUnit.module('Comscore tests', {
	setup: function () {
		Mercury.tracking = {
			comscore: {
				keyword: 'comscorekw',
				id: '123',
				c7: 'c7',
				c7Value: 'c7value'
			}
		};
	}
});

QUnit.test('Comscore is compiled into Mercury.Modules.Trackers namespace', function () {
	ok(Mercury.Modules.Trackers.Comscore);
	strictEqual(typeof Mercury.Modules.Trackers.Comscore, 'function');
});

QUnit.test('Track page view', function () {
	var tracker = new Mercury.Modules.Trackers.Comscore(),
		queue = [{
			c1: '2',
			c2: Mercury.tracking.comscore.id,
			options: {
				url_append: Mercury.tracking.comscore.keyword + '=' + Mercury.tracking.comscore.c7Value
			}
		}];

	tracker.appendScript = function () {};

	tracker.trackPageView();
	deepEqual(window._comscore, queue);
});
