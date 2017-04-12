import {module} from 'qunit';
import {test} from 'ember-qunit';

module('Unit | Utility | domain', () => {
	test('extracts domain from provided urls', (assert) => {
		const testCasesForExtractDomainFromUrl = [
			{
				url: 'http://thelastofus.james.wikia-dev.us/wiki/MakerTest',
				expected: 'thelastofus.james.wikia-dev.us',
			},
			{
				url: 'http://starwars.wikia-staging.com/wiki/MakerTest',
				expected: 'starwars.wikia-staging.com',
			},
			{
				url: 'witcher.wikia.com',
				expected: 'witcher.wikia.com',
			},
			{
				url: 'http://wikia.com',
				expected: 'wikia.com',
			},
			{
				url: 'http://greenhouse.io/costam/razraz?parametr1=costam.dwa&trzy',
				expected: 'greenhouse.io',
			},
			{
				url: '',
				expected: null,
			},
			{
				url: 'toniedomena',
				expected: null,
			},
			{
				url: 'wikia.',
				expected: null,
			},
		];

		testCasesForExtractDomainFromUrl.forEach((testCase) => {
			assert.strictEqual(require('mobile-wiki/utils/domain').extractDomainFromUrl(testCase.url), testCase.expected);
		});
	});
});
