QUnit.module('lib/Utils');

test('getWikiName', function () {
	var testCases = [
		{
			host: 'poznan.wikia.com',
			expected: 'poznan',
			description: 'Works for production sub-domains'
		} , {
			host: 'bg.poznan.wikia.com',
			expected: 'bg.poznan',
			description: 'Works for production sub-domains with language'
		} , {
			host: 'verify.poznan.wikia.com',
			expected: 'poznan',
			description: 'Works for verify sub-domains'
		} , {
			host: 'verify.bg.poznan.wikia.com',
			expected: 'bg.poznan',
			description: 'Works for verify sub-domains with language'
		} , {
			host: 'preview.poznan.wikia.com',
			expected: 'poznan',
			description: 'Works for preview sub-domains'
		} , {
			host: 'preview.bg.poznan.wikia.com',
			expected: 'bg.poznan',
			description: 'Works for preview sub-domains with language'
		} , {
			host: 'sandbox-test.poznan.wikia.com',
			expected: 'poznan',
			description: 'Works for sandbox sub-domains'
		} , {
			host: 'sandbox-test.bg.poznan.wikia.com',
			expected: 'bg.poznan',
			description: 'Works for sandbox sub-domains with language'
		} , {
			host: 'bg.poznan.wikia.locals',
			expected: 'community',
			description: 'Returns the default sub-domain if the url is wrong',
			wikiFallback: null
		} , {
			host: 'bg.poznan.wikia.locals',
			expected: 'glee',
			description: 'Returns the default (from localSettings) sub-domain if the url is wrong',
			wikiFallback: 'glee'
		}
	];
	testCases.forEach(function (testCase) {
		if (testCase.hasOwnProperty('wikiFallback')) {
			global.localSettings.wikiFallback = testCase.wikiFallback;
		}

		equal(global.getWikiName(testCase.host), testCase.expected, testCase.description);
	});
});
