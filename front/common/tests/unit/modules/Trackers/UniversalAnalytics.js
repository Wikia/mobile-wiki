/* global Mercury, ga */
QUnit.module('mercury/modules/Trackers/UniversalAnalytics', function (hooks) {
	var UniversalAnalytics,
		queue,
		objectEquals = function (x, y) {
			if (x === null || x === undefined || y === null || y === undefined) { return x === y; }
			// after this just checking type of one would be enough
			if (x.constructor !== y.constructor) { return false; }
			// if they are functions, they should exactly refer to same one (because of closures)
			if (x instanceof Function) { return x === y; }
			// if they are regexps, they should exactly refer to same one (it is hard to better equality check on current ES)
			if (x instanceof RegExp) { return x === y; }
			if (x === y || x.valueOf() === y.valueOf()) { return true; }
			if (Array.isArray(x) && x.length !== y.length) { return false; }

			// if they are dates, they must had equal valueOf
			if (x instanceof Date) { return false; }

			// if they are strictly equal, they both need to be object at least
			if (!(x instanceof Object)) { return false; }
			if (!(y instanceof Object)) { return false; }

			// recursive object equality check
			var p = Object.keys(x);
			return Object.keys(y).every(function (i) { return p.indexOf(i) !== -1; }) &&
				p.every(function (i) { return objectEquals(x[i], y[i]); });
		},
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
		require.entries['common/modules/Trackers/UniversalAnalytics'].callback(exports);

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
