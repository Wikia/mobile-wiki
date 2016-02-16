/* globals getLanguageWithDefault:true */
QUnit.module('lib/AuthUtils');

QUnit.test('getLanguageWithDefault', function (assert) {
	var testCases = [
		{
			i18n: {
				lng: function() {
					return 'ja';
				}
			},
			expected: 'ja'
		},
		{
			i18n: {
				lng: function() {
					return 'asd';
				}
			},
			expected: 'en'
		},
		{
			i18n: {
				lng: function() {
					return 1;
				}
			},
			expected: 'en'
		},
		{
			i18n: {
				lng: function() {
					return null;
				}
			},
			expected: 'en'
		},
		{
			i18n: {
				lng: function() {
					return undefined;
				}
			},
			expected: 'en'
		}
	];

	testCases.forEach(function (testCase) {
		assert.equal(getLanguageWithDefault(testCase.i18n), testCase.expected);
	});
});
