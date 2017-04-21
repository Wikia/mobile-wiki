import {test} from 'ember-qunit';
import {module} from 'qunit';
import sinon from 'sinon';
import truncateHelper from 'mobile-wiki/helpers/truncate';

const applicationInstanceModule = require('mobile-wiki/utils/application-instance');
let getServiceStub;

module('Unit | Helper | truncate', (hooks) => {
	hooks.beforeEach(() => {
		getServiceStub = sinon.stub(applicationInstanceModule, 'getService');
		getServiceStub.returns({
			error: (message, error) => {
				// eslint-disable-next-line no-console
				console.error(message, error);
			}
		});
	});

	hooks.afterEach(() => {
		getServiceStub.restore();
	});

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
