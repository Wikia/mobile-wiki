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
		},
		{
			lang: 1,
			expected: 'en'
		},
		{
			lang: null,
			expected: 'en'
		},
		{
			lang: undefined,
			expected: 'en'
		}
	];

	testCases.forEach(function (testCase) {
		assert.equal(getLanguageWithDefault(testCase.lang), testCase.expected);
	});
});
