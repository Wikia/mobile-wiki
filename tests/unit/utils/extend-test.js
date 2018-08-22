import { module, test } from 'qunit';
import require from 'require';

module('Unit | Utility | extend', () => {
	const extend = require('mobile-wiki/utils/extend').default;

	test('Extend function is exported', (assert) => {
		assert.ok(extend);
	});

	test('primitives', (assert) => {
		const obj = { a: 1, b: true, c: 'q' };
		const result = extend({}, obj);

		assert.deepEqual(result, obj);
	});

	test('deep object extend', (assert) => {
		const obj = { a: { b: 1, c: { d: 1, f: null, g: undefined, h: true, i: false } } };
		const expected = { a: { b: 1, c: { d: 1, f: null, g: undefined, h: true, i: false }, e: 2 } };
		const result = extend({ a: { e: 2 } }, obj);

		assert.deepEqual(result, expected);
	});

	test('deep object extend with array', (assert) => {
		const obj = { a: { b: 1, c: [1, 2, 3] } };
		const result = extend({}, obj);

		assert.deepEqual(result, obj);
	});
});
