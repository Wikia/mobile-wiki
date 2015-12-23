/* global Mercury, ga */
QUnit.module('mercury/modules/Trackers/UniversalAnalytics', function (hooks) {
	var UniversalAnalytics,
		queue,
		/**
		 * Checks how many times a command appears in the queue
		 */
		queueCount = function (command) {
			var count = 0,
				i = 0;
			for (; i < queue.length; i++) {
				if (queue[i][0] === command) {
					count++;
				}
			}
			return count;
		},
		/**
		 * Checks if a specific command array appears in the queue
		 */
		queueContains = function (commandArray) {
			var i;

			for (i = 0; i < queue.length; i++) {
				if (objectEquals(queue[i], commandArray)) {
					return true;
				}
			}

			return false;
		};

	hooks.beforeEach(function () {
		var exports = {},
			dimensions = [];

		dimensions[8] = 'test/article';
		mrequire.entries['mercury/modules/Trackers/UniversalAnalytics'].callback(exports);

		UniversalAnalytics = exports.default;
		UniversalAnalytics.setDimensions(dimensions);

		M.props({
			tracking: {
				ua: {
					primary: {
						id: '123',
						sampleRate: 10
					},
					ads: {
						prefix: 'ads',
						id: '789',
						sampleRate: 100
					}
				}
			}
			// instantiate with mutation because tests are run multiple times
		}, true);

		// Mock Analytics Interface queue
		queue = [];
		window.ga = function () {
			queue.push(Array.prototype.slice.call(arguments));
		};
	});

	QUnit.test('UniversalAnalytics module exports class as default', function () {
		ok(UniversalAnalytics);
		strictEqual(typeof UniversalAnalytics, 'function');
	});

	QUnit.test('UniversalAnalytics constructor', function () {
		new UniversalAnalytics();

		strictEqual(queueCount('create'), 2);
		strictEqual(queueCount('require'), 1);
		strictEqual(queueCount('ads.require'), 1);

		ok(queueContains(['create', '123', 'auto', {'name': '', 'allowLinker': true, 'sampleRate': 10}]));
		ok(queueContains(['create', '789', 'auto', {'name': 'ads', 'allowLinker': true, 'sampleRate': 100}]));
	});

	QUnit.test('Track event', function () {
		var instance = new UniversalAnalytics();
		instance.track('category', 'action', 'label', 42, true);
		ok(queueContains([
			'send',
			{
				'hitType': 'event',
				'eventCategory': 'category',
				'eventAction': 'action',
				'eventLabel': 'label',
				'eventValue': 42,
				'nonInteraction': true,
			}
		]));
	});

	QUnit.test('Track page view', function () {
		var instance = new UniversalAnalytics();
		instance.trackPageView();
		ok(queueContains(['send', 'pageview']));
	});

	QUnit.test('Track ads-related event', function () {
		var instance = new UniversalAnalytics();
		instance.trackAds('testCategory', 'testAction', 'testLabel', 0, true);
		ok(queueContains([
			'ads.send',
			{
				'hitType': 'event',
				'eventCategory': 'testCategory',
				'eventAction': 'testAction',
				'eventLabel': 'testLabel',
				'eventValue': 0,
				'nonInteraction': true,
			}
		]));
	});
});
