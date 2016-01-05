import {test} from 'ember-qunit';
import {module} from 'qunit';
import truncateHelper from 'main/helpers/truncate';

module('Unit | Helper | truncate', () => {
	test('Truncate helper is exported', (assert) => {
		assert.ok(truncateHelper.compute);
	});

	test('short text', (assert) => {
		assert.equal(truncateHelper.compute(['short text']), 'short text');
	});

	test('long text', (assert) => {
		assert.equal(truncateHelper.compute(['long text, please truncate', 20]), 'long text, please\u2026');
	});

	test('number instead of text', (assert) => {
		assert.equal(truncateHelper.compute([20]), null);
	});
});
