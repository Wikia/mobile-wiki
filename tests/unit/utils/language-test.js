import {module, test} from 'qunit';
import require from 'require';

module('Unit | Utility | language', (hooks) => {
	let getLanguageCodeFromRequest;

	hooks.beforeEach(() => {
		getLanguageCodeFromRequest = require('mobile-wiki/utils/language').default;
	});

	test('test getLanguageCodeFromRequest', (assert) => {
		const testCases = [
			{
				path: '/wiki/TestArticle',
				expectedLangPath: null
			},
			{
				path: '/article-preview',
				expectedLangPath: null
			},
			{
				path: '/test-path',
				expectedLangPath: null
			},
			{
				path: '/tes-tpath/test',
				expectedLangPath: '/tes-tpath'
			},
			{
				path: '/pl/wiki/TestArticle',
				expectedLangPath: '/pl'
			},
			{
				path: '/pt-br/wiki/TestArticle',
				expectedLangPath: '/pt-br'
			},
			{
				path: '/nl-informal/wiki/TestArticle',
				expectedLangPath: '/nl-informal'
			}
		];

		testCases.forEach((testCase) => {
			assert.equal(getLanguageCodeFromRequest(testCase.path), testCase.expectedLangPath);
		});
	});
});
