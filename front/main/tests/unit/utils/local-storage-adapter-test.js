import {module} from 'qunit';
import {test} from 'ember-qunit';

module('Unit | Utils | local storage adapter', () => {
	const windowMock = {
		localStorage: null
	};

	test('getItem/setItem works', (assert) => {
		var localStorageAdapter;

		windowMock.localStorageAdapter = localStorageAdapter;
		with (windowMock) {
			localStorageAdapter = require('main/utils/local-storage-adapter').default;
		}
		windowMock.localStorageAdapter.setItem('foo', 'bar');
		assert.strictEqual(windowMock.localStorageAdapter.getItem('foo'), 'bar');
	});

	test('removeItem works', (assert) => {
		var localStorageAdapter;

		windowMock.localStorageAdapter = localStorageAdapter;
		with (windowMock) {
			localStorageAdapter = require('main/utils/local-storage-adapter').default;
		}
		windowMock.localStorageAdapter.setItem('foo', 'bar');
		windowMock.localStorageAdapter.removeItem('foo');
		assert.strictEqual(windowMock.localStorageAdapter.getItem('foo') || false, false);
	});
});
