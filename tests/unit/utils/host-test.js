import {module} from 'qunit';
import require from 'require';
import {test} from 'ember-qunit';
import Ember from 'ember';

module('Unit | Utility | host', () => {
	test('returns correct host', (assert) => {
		const testCases = [
			{
				headers: {},
				host: 'starwars.wikia.com',
				expected: 'starwars.wikia.com',
			},
			{
				headers: {
					'x-original-host': 'starwars.sandbox-xw1.wikia.com'
				},
				host: 'starwars.wikia.com',
				expected: 'starwars.sandbox-xw1.wikia.com',
			},
			{
				headers: {
					'x-original-host': 'starwars.externaltest.wikia.com',
					'x-staging': 'externaltest'
				},
				host: 'starwars.wikia.com',
				expected: 'starwars.wikia.com',
			},
			{
				headers: {
					'x-original-host': 'starwars.wikia.com',
					'x-staging': 'externaltest'
				},
				host: 'starwars.showcase.wikia.com',
				expected: 'starwars.wikia.com',
			},
		];

		testCases.forEach((testCase) => {
			const request = Ember.Object.create();

			request.setProperties({
				headers: Ember.Object.create(testCase.headers),
				host: testCase.host
			});

			assert.strictEqual(require('mobile-wiki/utils/host').default(request), testCase.expected);
		});
	});
});
