/* global Em, _qevents */
QUnit.module('Quantserve tests', {
	setup: function () {
		Mercury.tracking = {
			quantserve: '1234',
		};
	}
});

QUnit.test('Quantserve is compiled into Mercury.Modules.Trackers namespace', function () {
	ok(Mercury.Modules.Trackers.Quantserve);
	strictEqual(typeof Mercury.Modules.Trackers.Quantserve, 'function');
});

QUnit.test('Track page view', function () {
	var tracker = new Mercury.Modules.Trackers.Quantserve(),
		context = {
			wikiCategory: 'category',
			wikiCustomKeyValues: 'key1=val1;key2=val2;key3=val3'
		},
		qevents = [{
			qacct: Mercury.tracking.quantserve,
			labels: 'category,category.val1,category.val2,category.val3'
		}];

	tracker.appendScript = function () {};
	tracker.getContext = function () {
		return context;
	};

	tracker.trackPageView();
	deepEqual(window._qevents, qevents);
});
