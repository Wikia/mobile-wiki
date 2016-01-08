QUnit.module('mercury/utils/variantTesting', function (hooks) {
	var getLastItem = function () {
		return window.optimizely[window.optimizely.length - 1];
	};

	hooks.beforeEach(function () {
		window.optimizely = [];
	});

	QUnit.test('Activate Optimizely', function (assert) {
		require('common/utils/variantTesting').activate();

		assert.deepEqual(getLastItem(), ['activate']);
	});

	QUnit.test('Event tracking', function (assert) {
		require('common/utils/variantTesting').trackEvent('herd_cats');

		assert.deepEqual(getLastItem(), ['trackEvent', 'herd_cats']);
	});
});
