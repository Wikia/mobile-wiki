import { module, test } from 'qunit';
import require from 'require';

module(() => {
	const duration = require('mobile-wiki/utils/duration').default;

	test('Duration helper is exported', (assert) => {
		assert.ok(duration);
	});

	test('< 0 seconds', (assert) => {
		assert.equal(duration(-59), '00:00');
	});

	test('0 seconds', (assert) => {
		assert.equal(duration(0), '00:00');
	});

	test('< 60 seconds', (assert) => {
		assert.equal(duration(59), '00:59');
	});

	test('> 60 seconds and < 1 hour', (assert) => {
		assert.equal(duration(181), '03:01');
	});

	test('> 1 hour', (assert) => {
		assert.equal(duration(3661), '01:01:01');
	});
}, function() {});