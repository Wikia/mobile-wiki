import {module, test} from 'qunit';
import require from 'require';

module(() => {
	const extend = require('mobile-wiki/utils/extend').default;

	test('Extend function is exported', (assert) => {
		assert.ok(extend);
	});

	test('primitives', (assert) => {
		const obj = {a: 1, b: true, c: 'q'},
			result = extend({}, obj);

		assert.deepEqual(result, obj);
	});

	test('deep object extend', (assert) => {
		const obj = {a: {b: 1, c: {d: 1}}},
			expected = {a: {b: 1, c: {d: 1}, e: 2}},
			result = extend({a: {e: 2}}, obj);

		assert.deepEqual(result, expected);
	});

	test('deep object extend with array', (assert) => {
		const obj = {a: {b: 1, c: [1, 2, 3]}},
			result = extend({}, obj);

		assert.deepEqual(result, obj);
	});
});
