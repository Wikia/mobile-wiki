/* global window, M */
QUnit.module('variantTesting tests', {
	setup: function () {
		window.optimizely = [];

		this.getLastItem = function () {
			return window.optimizely[window.optimizely.length - 1];
		};
	}
});

test('Activate Optimizely', function () {
	require('mercury/utils/variantTesting').activate();
	deepEqual(this.getLastItem(), ['activate']);
});

test('Event tracking', function () {
	require('mercury/utils/variantTesting').trackEvent('herd_cats');
	deepEqual(this.getLastItem(), ['trackEvent', 'herd_cats']);
});

