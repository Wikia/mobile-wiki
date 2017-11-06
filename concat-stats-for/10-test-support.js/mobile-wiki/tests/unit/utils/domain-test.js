define('mobile-wiki/tests/unit/utils/domain-test', ['qunit', 'require', 'ember-qunit'], function (_qunit, _require2, _emberQunit) {
	'use strict';

	(0, _qunit.module)('Unit | Utility | domain', function () {
		(0, _emberQunit.test)('extracts domain from provided urls', function (assert) {
			var testCasesForExtractDomainFromUrl = [{
				url: 'http://thelastofus.james.wikia-dev.us/wiki/MakerTest',
				expected: 'thelastofus.james.wikia-dev.us'
			}, {
				url: 'http://starwars.wikia-staging.com/wiki/MakerTest',
				expected: 'starwars.wikia-staging.com'
			}, {
				url: 'witcher.wikia.com',
				expected: 'witcher.wikia.com'
			}, {
				url: 'http://wikia.com',
				expected: 'wikia.com'
			}, {
				url: 'http://greenhouse.io/costam/razraz?parametr1=costam.dwa&trzy',
				expected: 'greenhouse.io'
			}, {
				url: '',
				expected: null
			}, {
				url: 'toniedomena',
				expected: null
			}, {
				url: 'wikia.',
				expected: null
			}];

			testCasesForExtractDomainFromUrl.forEach(function (testCase) {
				assert.strictEqual((0, _require2.default)('mobile-wiki/utils/domain').default(testCase.url), testCase.expected);
			});
		});
	});
});