import {module} from 'qunit';
import {test} from 'ember-qunit';

module('Unit | Utils | local storage adapter', () => {
	test('getItem/setItem works', (assert) => {
		const localStorageAdapter = require('main/utils/local-storage-adapter').localStorageAdapter;

		localStorageAdapter.setItem('foo', 'bar');
		assert.strictEqual(localStorageAdapter.getItem('foo'), 'bar');
	});

	test('clear works', (assert) => {
		const localStorageAdapter = require('main/utils/local-storage-adapter').localStorageAdapter;

		localStorageAdapter.setItem('foo', 'bar');
		localStorageAdapter.removeItem('foo');
		assert.strictEqual(localStorageAdapter.getItem('foo') || false, false);
	});

	test('removeItem works', (assert) => {
		const localStorageAdapter = require('main/utils/local-storage-adapter').localStorageAdapter;

		localStorageAdapter.setItem('foo', 'bar');
		localStorageAdapter.removeItem('foo');
		assert.strictEqual(localStorageAdapter.getItem('foo') || false, false);
	});
});
