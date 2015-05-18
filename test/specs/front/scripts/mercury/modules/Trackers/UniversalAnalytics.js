/* global Mercury, ga */
QUnit.module('UniversalAnalytics tests', {
	setup: function () {

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
		var queue = [];
		window.ga = function () {
			queue.push(Array.prototype.slice.call(arguments));
		};
		this.queue = queue;
		/**
		 * Checks how many times a command appears in the queue
		 */
		this.queueCount = function (command) {
			var count = 0,
				i = 0;
			for (; i < this.queue.length; i++) {
				if (this.queue[i][0] === command) {
					count++;
				}
			}
			return count;
		};

		/**
		 * Checks if a specific command array appears in the queue
		 */
		this.queueContains = function (commandArray) {
			var i;

			for (i = 0; i < this.queue.length; i++) {
				if (objectEquals(this.queue[i], commandArray)) {
					return true;
				}
			}

			return false;
		};
	}
});

QUnit.test('UniversalAnalytics is compiled into Mercury.Modules.Trackers namespace', function () {
	ok(Mercury.Modules.Trackers.UniversalAnalytics);
	strictEqual(typeof Mercury.Modules.Trackers.UniversalAnalytics, 'function');
});

QUnit.test('UniversalAnalytics constructor', function () {
	new Mercury.Modules.Trackers.UniversalAnalytics();

	strictEqual(this.queueCount('create'), 2);
	strictEqual(this.queueCount('require'), 1);
	strictEqual(this.queueCount('ads.require'), 1);

	ok(this.queueContains(['create', '123', 'auto', {'name': '', 'allowLinker': true, 'sampleRate': 10}]));
	ok(this.queueContains(['create', '789', 'auto', {'name': 'ads', 'allowLinker': true, 'sampleRate': 100}]));
});

QUnit.test('Track event', function () {
	var tracker = new Mercury.Modules.Trackers.UniversalAnalytics();
	tracker.track('category', 'action', 'label', 42, true);
	ok(this.queueContains([
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
	var tracker = new Mercury.Modules.Trackers.UniversalAnalytics();
	tracker.trackPageView();
	ok(this.queueContains(['send', 'pageview']));
});

QUnit.test('Track ads-related event', function () {
	var tracker = new Mercury.Modules.Trackers.UniversalAnalytics();
	tracker.trackAds('testCategory', 'testAction', 'testLabel', 0, true);
	ok(this.queueContains([
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
