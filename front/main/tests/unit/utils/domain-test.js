import {module} from 'qunit';
import {test} from 'ember-qunit';

module('Unit | Utility | domain', () => {
	test('gets domain from provided hosts', (assert) => {
		const testCases = [
			{
				hostname: 'witcher.wikia.com',
				expected: 'wikia.com'
			},
			{
				hostname: 'fallout.warkot.wikia-dev.com',
				expected: 'wikia-dev.com'
			},
			{
				hostname: 'no-dots-here',
				expected: 'no-dots-here'
			},
			{
				expected: window.location.hostname
			}
		];

		testCases.forEach((testCase) => {
			assert.strictEqual(require('main/utils/domain').getDomain(testCase.hostname), testCase.expected);
		});
	});
});
