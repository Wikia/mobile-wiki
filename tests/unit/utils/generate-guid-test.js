import { module, test } from 'qunit';
import sinon from 'sinon';
import generateGuid from 'mobile-wiki/utils/generate-guid';

module((hooks) => {
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
}, function() {});