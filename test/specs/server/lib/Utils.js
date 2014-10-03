QUnit.module('lib/Utils');

test('getWikiName', function () {
	var testCases = [
		{
			host: 'poznan.wikia.com',
			expected: 'poznan.wikia.com',
			description: 'Works for production sub-domains',
			environment: 'production'
		}, {
			host: 'example.com',
			expected: 'example.com',
			description: 'Custom URLs on production are passed through',
			environment: 'production'
		}, {
			host: 'poznan.wikia.com',
			expected: 'poznan.wikia.com',
			description: 'Works for production sub-domains',
			environment: 'production'
		} , {
			host: 'bg.poznan.wikia.com',
			expected: 'bg.poznan.wikia.com',
			description: 'Works for production sub-domains with language',
			environment: 'production'
		} , {
			host: 'verify.poznan.wikia.com',
			expected: 'verify.poznan.wikia.com',
			description: 'Works for verify sub-domains',
			environment: 'verify'
		} , {
			host: 'verify.bg.poznan.wikia.com',
			expected: 'verify.bg.poznan.wikia.com',
			description: 'Works for verify sub-domains with language',
			environment: 'verify'
		} , {
			host: 'preview.poznan.wikia.com',
			expected: 'preview.poznan.wikia.com',
			description: 'Works for preview sub-domains',
			environment: 'preview'
		} , {
			host: 'preview.bg.poznan.wikia.com',
			expected: 'preview.bg.poznan.wikia.com',
			description: 'Works for preview sub-domains with language',
			environment: 'preview'
		} , {
			host: 'sandbox-test.poznan.wikia.com',
			expected: 'sandbox-test.poznan.wikia.com',
			description: 'Works for sandbox sub-domains',
			environment: 'sandbox',
			mediawikiHost: 'sandbox-test'
		} , {
			host: 'sandbox-test.bg.poznan.wikia.com',
			expected: 'sandbox-test.bg.poznan.wikia.com',
			description: 'Works for sandbox sub-domains with language',
			environment: 'sandbox',
			mediawikiHost: 'sandbox-test'
		} , {
			host: 'bg.poznan.wikia.locals',
			expected: 'community.bimbo.wikia-dev.com',
			description: 'Returns the default sub-domain if the url is wrong',
			wikiFallback: null,
			environment: 'devtest',
			mediawikiHost: 'bimbo'
		} , {
			host: 'bg.poznan.wikia.locals',
			expected: 'glee.bimbo.wikia-dev.com',
			wikiFallback: 'glee',
			environment: 'devtest',
			mediawikiHost: 'bimbo',
			description: 'Returns the default (from localSettings) sub-domain if the url is wrong'
		} , {
			host: '',
			expected: 'community.wikia.com',
			environment: 'production',
			description: 'Returns the default domain when no domain is provided'
		}, {
			host: '',
			expected: 'preview.community.wikia.com',
			environment: 'preview',
			description: 'Returns the default domain when no domain is provided on preview'
		}, {
			host: '',
			expected: 'verify.community.wikia.com',
			environment: 'verify',
			description: 'Returns the default domain when no domain is provided on verify'
		}
	];

	function setupLocalSettings(testCase) {
		global.localSettings.wikiFallback = testCase.wikiFallback;
		global.localSettings.host = testCase.host;
		global.localSettings.environment = testCase.environment;
		global.localSettings.isProduction = testCase.environment === 'production';
		global.localSettings.host = testCase.lsHost;
		global.localSettings.mediawikiHost = testCase.mediawikiHost
	}

	testCases.forEach(function (testCase) {
		setupLocalSettings(testCase);
		equal(global.getWikiDomainName(testCase.host), testCase.expected, testCase.description);
	});
});
