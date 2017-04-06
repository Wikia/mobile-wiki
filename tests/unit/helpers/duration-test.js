import {test} from 'ember-qunit';
import {module} from 'qunit';
import duration from 'mobile-wiki/helpers/duration';

module('Unit | Helper | duration', () => {
	test('Duration helper is exported', (assert) => {
		assert.ok(duration.compute);
	});

	test('< 0 seconds', (assert) => {
		assert.equal(duration.compute([-59]), '00:00');
	});

	test('0 seconds', (assert) => {
		assert.equal(duration.compute([0]), '00:00');
	});

	test('< 60 seconds', (assert) => {
		assert.equal(duration.compute([59]), '00:59');
	});

	test('> 60 seconds and < 1 hour', (assert) => {
		assert.equal(duration.compute([181]), '03:01');
	});

	test('> 1 hour', (assert) => {
		assert.equal(duration.compute([3661]), '01:01:01');
	});
});
