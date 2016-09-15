import {module} from 'qunit';
import {test} from 'ember-qunit';

module('Unit | Utility | url', (hooks) => {
	let addQueryParams;

	hooks.beforeEach(() => {
		addQueryParams = require('main/utils/url').addQueryParams;
	});

	test('addQueryParams helper is exported', (assert) => {
		assert.ok(addQueryParams);
	});

	test('no params', (assert) => {
		assert.equal(addQueryParams('http://wikia.com'), 'http://wikia.com');
	});

	test('empty object as params', (assert) => {
		assert.equal(addQueryParams('http://wikia.com', {}), 'http://wikia.com');
	});

	test('single param', (assert) => {
		assert.equal(addQueryParams('http://wikia.com', {
			foo: 1
		}), 'http://wikia.com?foo=1');
	});

	test('multiple params', (assert) => {
		assert.equal(addQueryParams('http://wikia.com', {
			foo: 1,
			bar: 2
		}), 'http://wikia.com?foo=1&bar=2');
	});

	test('existing param', (assert) => {
		assert.equal(addQueryParams('http://wikia.com?lorem=ipsum', {
			foo: 1
		}), 'http://wikia.com?lorem=ipsum&foo=1');
	});
});
