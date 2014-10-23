/* global Mercury, _gaq */
QUnit.module('GoogleAnalytics tests', {
	setup: function () {
		Mercury.tracking = {
			ga: {
				primary: {
					id: '123',
					sampleRate: 10
				},
				mercury: {
					prefix: 'mercury',
					id: '456',
					sampleRate: 100
				}
			}
		};
		// Mock GA queue
		var queue = [];
		window._gaq = {
			push: function (commandArray) {
				queue.push(commandArray);
			}
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
			var count = 0,
				i, j, contains;
			for (i = 0; i < this.queue.length; i++) {
				if (contains === true) {
					return true;
				}
				contains = true;
				for (j = 0; j < this.queue[i][j]; j++) {
					if (this.queue[i][j] !== commandArray[j]) {
						contains = false;
						break;
					}
				}
			}
			return false;
		};
	}
});

QUnit.test('GoogleAnalytics is compiled into Mercury.Modules.Trackers namespace', function () {
	ok(Mercury.Modules.Trackers.GoogleAnalytics);
	equal(typeof Mercury.Modules.Trackers.GoogleAnalytics, 'function');
});

QUnit.test('GoogleAnalytics constructor', function () {
	new Mercury.Modules.Trackers.GoogleAnalytics();
	strictEqual(this.queueCount('_setAccount'), 1);
	strictEqual(this.queueCount('_setSampleRate'), 1);
	strictEqual(this.queueContains(['_setAccount', '123']), true);
	strictEqual(this.queueContains(['_setSampleRate', '10']), true);
	strictEqual(this.queueContains(['mercury._setAccount', '456']), true);
	strictEqual(this.queueContains(['mercury._setSampleRate', '100']), true);
});

QUnit.test('Special wiki', function () {
	var tracker = new Mercury.Modules.Trackers.GoogleAnalytics();
	// Special wiki var is undefined
	strictEqual(tracker.isSpecialWiki(), false);
	// false
	Mercury.wiki.isGASpecialWiki = false;
	strictEqual(tracker.isSpecialWiki(), false);
	// true
	Mercury.wiki.isGASpecialWiki = true;
	strictEqual(tracker.isSpecialWiki(), true);
});

QUnit.test('Track event', function () {
	var tracker = new Mercury.Modules.Trackers.GoogleAnalytics();
	tracker.track('category', 'action', 'label', 42, true);
	strictEqual(this.queueContains(['_trackEvent', 'category', 'action', 'label', 42, true]), true);
});

QUnit.test('Track page view', function () {
	var tracker = new Mercury.Modules.Trackers.GoogleAnalytics();
	tracker.trackPageView();
	strictEqual(this.queueContains(['_trackPageView']), true);
});
