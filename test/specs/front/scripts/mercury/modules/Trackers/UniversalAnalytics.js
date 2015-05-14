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
		 * Checks if two objects are equal (recurisvely)
		 */
		this.objectEquals = function (x, y) {
			var self = this;
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
				p.every(function (i) { return self.objectEquals(x[i], y[i]); });
		};


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
				if (this.objectEquals(this.queue[i], commandArray)) {
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
