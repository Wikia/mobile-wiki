import {module} from 'qunit';
import {test} from 'ember-qunit';
import sinon from 'sinon';
import generateGuid from 'main/utils/generate-guid';

module('Unit | Utility | generate-guid', (hooks) => {
	hooks.beforeEach(() => {
		sinon.stub(Date, 'now').returns('1234');
	});

	hooks.afterEach(() => {
		Date.now.restore();
	});

	test('generateGuid helper is exported', (assert) => {
		assert.ok(generateGuid);
	});

	test('creates unique string with and without params', (assert) => {
		const testCases = [
			{
				prefix: 'label',
				expected: 'label1234'
			},
			{
				expected: '1234'
			}
		];

		testCases.forEach((testCase) => {
			assert.strictEqual(generateGuid(testCase.prefix), testCase.expected);
		});
	});
});
