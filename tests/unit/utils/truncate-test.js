import {module} from 'qunit';
import {test} from 'ember-qunit';
import sinon from 'sinon';

const applicationInstanceModule = require('mobile-wiki/utils/application-instance');
let getServiceStub;

module('Unit | Utility | truncate', (hooks) => {
	let truncate;

	hooks.beforeEach(() => {
		truncate = require('mobile-wiki/utils/truncate').truncate;

		getServiceStub = sinon.stub(applicationInstanceModule, 'getService');
		getServiceStub.returns({
			error: (message, error) => {
				// eslint no-console: 0
				console.error(message, error);
			}
		});
	});

	hooks.afterEach(() => {
		getServiceStub.restore();
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

	test('long text, whitespace in place of truncation', (assert) => {
		assert.equal(truncate('123456789 long text here', 10), '123456789\u2026');
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
