QUnit.module('common/utils/variant-testing', function (hooks) {
	var getLastItem = function () {
		return window.optimizely[window.optimizely.length - 1];
	};

	hooks.beforeEach(function () {
		window.optimizely = [];
	});

	QUnit.test('Activate Optimizely', function (assert) {
		require('common/utils/variant-testing').activate();

		assert.deepEqual(getLastItem(), ['activate']);
	});

	QUnit.test('Event tracking', function (assert) {
		require('common/utils/variant-testing').trackEvent('herd_cats');

		assert.deepEqual(getLastItem(), ['trackEvent', 'herd_cats']);
	});
});
