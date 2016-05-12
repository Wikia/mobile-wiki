import {module} from 'qunit';
import {test} from 'ember-qunit';

module('Unit | Utility | truncate', (hooks) => {
	let truncate;

	hooks.beforeEach(() => {
		truncate = require('main/utils/truncate').truncate;
	});

	test('Truncate helper is exported', (assert) => {
		assert.ok(truncate);
	});

	test('short text', (assert) => {
		assert.equal(truncate('short text'), 'short text');
	});

	test('long text', (assert) => {
		assert.equal(truncate('long text, please truncate', 20), 'long text, please\u2026');
	});

	test('long text, default truncation', (assert) => {
		assert.equal(truncate('long text, please truncate at the end dasdasdasdasdsadsadsa'),
			'long text, please truncate at the end\u2026');
	});

	test('long text, truncation after whitespace', (assert) => {
		assert.equal(truncate('trala laaa p\tadasd\n', 16), 'trala laaa p\u2026');
	});

	test('short text, truncation after newline char', (assert) => {
		assert.equal(truncate('123\n5678', 6), '123\u2026');
	});

	test('long text, default truncation', (assert) => {
		assert.equal(truncate('long text, please truncate at the end blablabla blablabla'),
			'long text, please truncate at the end blablabla\u2026');
	});

	test('number instead of text', (assert) => {
		assert.equal(truncate(20), null);
	});
});
