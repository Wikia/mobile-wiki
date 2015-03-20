/* global window, M */
QUnit.module('variantTesting tests', {
	setup: function () {
		window.optimizely = [];

		this.getLastItem = function () {
			return window.optimizely[window.optimizely.length - 1];
		};
	}
});

QUnit.test('Activate Optimizely', function () {
	M.VariantTesting.activate();
	deepEqual(this.getLastItem(), ['activate']);
});

QUnit.test('Event tracking', function () {
	M.VariantTesting.trackEvent('herd_cats');
	deepEqual(this.getLastItem(), ['trackEvent', 'herd_cats']);
});

