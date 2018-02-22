import {module, test} from 'qunit';
import require from 'require';

module('Unit | Utility | local storage conncetor', () => {
	test('getItem/setItem works', (assert) => {
		const localStorageAdapter = require('mobile-wiki/utils/local-storage-connector').localStorageAdapter;

		localStorageAdapter.setItem('foo', 'bar');
		assert.strictEqual(localStorageAdapter.getItem('foo'), 'bar');
	});

	test('clear works', (assert) => {
		const localStorageAdapter = require('mobile-wiki/utils/local-storage-connector').localStorageAdapter;

		localStorageAdapter.setItem('foo', 'bar');
		localStorageAdapter.removeItem('foo');
		assert.strictEqual(localStorageAdapter.getItem('foo') || false, false);
	});

	test('removeItem works', (assert) => {
		const localStorageAdapter = require('mobile-wiki/utils/local-storage-connector').localStorageAdapter;

		localStorageAdapter.setItem('foo', 'bar');
		localStorageAdapter.removeItem('foo');
		assert.strictEqual(localStorageAdapter.getItem('foo') || false, false);
	});
});
