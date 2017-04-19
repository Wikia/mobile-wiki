import {test} from 'ember-qunit';
import {module} from 'qunit';
import sinon from 'sinon';
import truncateHelper from 'mobile-wiki/helpers/truncate';

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
		const getServiceStub = sinon.stub(
			require('mobile-wiki/utils/application-instance'),
			'getService'
		).returns({
			error: console.debug
		});

		assert.equal(truncateHelper.compute([20]), null);

		getServiceStub.restore();
	});
});
