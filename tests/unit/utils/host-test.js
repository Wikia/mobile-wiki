import {module} from 'qunit';
import {test} from 'ember-qunit';

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
					'x-staging': 'externaltest'
				},
				host: 'externaltest.starwars.wikia.com',
				expected: 'starwars.wikia.com',
			},
			{
				headers: {
					'x-staging': 'externaltest'
				},
				host: 'showcase.starwars.wikia.com',
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
