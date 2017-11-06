define('mobile-wiki/tests/unit/utils/host-test', ['qunit', 'require', 'ember-qunit'], function (_qunit, _require2, _emberQunit) {
	'use strict';

	(0, _qunit.module)('Unit | Utility | host', function () {
		(0, _emberQunit.test)('returns correct host', function (assert) {
			var testCases = [{
				headers: {},
				host: 'starwars.wikia.com',
				expected: 'starwars.wikia.com'
			}, {
				headers: {
					'x-original-host': 'sandbox-xw1.starwars.wikia.com'
				},
				host: 'starwars.wikia.com',
				expected: 'sandbox-xw1.starwars.wikia.com'
			}, {
				headers: {
					'x-original-host': 'externaltest.starwars.wikia.com',
					'x-staging': 'externaltest'
				},
				host: 'starwars.wikia.com',
				expected: 'starwars.wikia.com'
			}, {
				headers: {
					'x-original-host': 'starwars.wikia.com',
					'x-staging': 'externaltest'
				},
				host: 'showcase.starwars.wikia.com',
				expected: 'starwars.wikia.com'
			}];

			testCases.forEach(function (testCase) {
				var request = Ember.Object.create();

				request.setProperties({
					headers: Ember.Object.create(testCase.headers),
					host: testCase.host
				});

				assert.strictEqual((0, _require2.default)('mobile-wiki/utils/host').default(request), testCase.expected);
			});
		});
	});
});