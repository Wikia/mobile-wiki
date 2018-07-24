import { module, test } from 'qunit';
import require from 'require';

module('Unit | Utility | url', (hooks) => {
	let addQueryParams;

	hooks.beforeEach(() => {
		addQueryParams = require('mobile-wiki/utils/url').addQueryParams;
	});

	test('isHashLink', (assert) => {
		const testCases = [
			{
				href: 'http://google.com',
				expected: false
			},
			{
				href: '#Section',
				expected: true
			},
			{
				href: '/wiki/Kermit#Section',
				expected: false
			},
			{
				expected: false
			}
		];
		const isHashLink = require('mobile-wiki/utils/url').isHashLink;

		testCases.forEach((testCase) => {
			const result = isHashLink({
				hasAttribute: () => testCase.hasOwnProperty('href'),
				getAttribute: () => testCase.href
			});

			assert.equal(result, testCase.expected);
		});
	});

	test('add correctly query param', (assert) => {
		const testCases = [
			{
				href: 'http://google.com',
				params: {
					q1: 'aa',
					q2: 'bb'
				},
				expected: 'http://google.com?q1=aa&q2=bb'
			},
			{
				href: 'http://google.com?someinitialqp=asdf',
				params: {
					q1: 'aa',
					q2: 'bb'
				},
				expected: 'http://google.com?someinitialqp=asdf&q1=aa&q2=bb'
			},
		];

		testCases.forEach((testCase) => {
			const result = addQueryParams(testCase.href, testCase.params);

			assert.equal(result, testCase.expected);
		});
	});
});
