define('mobile-wiki/tests/unit/utils/local-storage-connector-test', ['qunit', 'require', 'ember-qunit'], function (_qunit, _require2, _emberQunit) {
	'use strict';

	(0, _qunit.module)('Unit | Utility | local storage adapter', function () {
		(0, _emberQunit.test)('getItem/setItem works', function (assert) {
			var localStorageAdapter = (0, _require2.default)('mobile-wiki/utils/local-storage-connector').localStorageAdapter;

			localStorageAdapter.setItem('foo', 'bar');
			assert.strictEqual(localStorageAdapter.getItem('foo'), 'bar');
		});

		(0, _emberQunit.test)('clear works', function (assert) {
			var localStorageAdapter = (0, _require2.default)('mobile-wiki/utils/local-storage-connector').localStorageAdapter;

			localStorageAdapter.setItem('foo', 'bar');
			localStorageAdapter.removeItem('foo');
			assert.strictEqual(localStorageAdapter.getItem('foo') || false, false);
		});

		(0, _emberQunit.test)('removeItem works', function (assert) {
			var localStorageAdapter = (0, _require2.default)('mobile-wiki/utils/local-storage-connector').localStorageAdapter;

			localStorageAdapter.setItem('foo', 'bar');
			localStorageAdapter.removeItem('foo');
			assert.strictEqual(localStorageAdapter.getItem('foo') || false, false);
		});
	});
});