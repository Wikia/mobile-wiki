/* global window, M */
QUnit.module('variantTesting tests', {
	beforeEach: function () {
		window.optimizely = [];
	}
}, function (hooks) {
	var getLastItem = function () {
		return window.optimizely[window.optimizely.length - 1];
	};

	QUnit.test('Activate Optimizely', function (assert) {
		require('mercury/utils/variantTesting').activate();

		assert.deepEqual(getLastItem(), ['activate']);
	});

	QUnit.test('Event tracking', function (assert) {
		require('mercury/utils/variantTesting').trackEvent('herd_cats');

		assert.deepEqual(getLastItem(), ['trackEvent', 'herd_cats']);
	});
});
