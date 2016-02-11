/* globals getLanguageWithDefault:true */

QUnit.module('lib/AuthUtils');

QUnit.test('getLanguageWithDefault', function (assert) {
	var testCases = [
		{
			lang: 'ja',
			expected: 'ja'
		},
		{
			lang: 'asd',
			expected: 'en'
		}
	];

	testCases.forEach(function (testCase) {
		assert.equal(getLanguageWithDefault(testCase.lang), testCase.expected);
	});
});
