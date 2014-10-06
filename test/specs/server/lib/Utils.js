QUnit.module('lib/Utils');

test('getWikiName', function () {
	var testCases = [
		{
			host: 'poznan.wikia.com',
			localSettings: {
				environment: global.Environment.Production
			},
			expected: 'poznan.wikia.com',
			description: 'Works for production sub-domains'
		}, {
			host: 'example.com',
			localSettings: {
				environment: global.Environment.Production
			},
			expected: 'example.com',
			description: 'Custom URLs on production are passed through'
		}, {
			host: 'poznan.wikia.com',
			localSettings: {
				environment: global.Environment.Production
			},
			expected: 'poznan.wikia.com',
			description: 'Works for production sub-domains'
		} , {
			host: 'bg.poznan.wikia.com',
			localSettings: {
				environment: global.Environment.Production
			},
			expected: 'bg.poznan.wikia.com',
			description: 'Works for production sub-domains with language'
		} , {
			host: 'verify.poznan.wikia.com',
			localSettings: {
				environment: global.Environment.Verify
			},
			expected: 'verify.poznan.wikia.com',
			description: 'Works for verify sub-domains'
		} , {
			host: 'verify.bg.poznan.wikia.com',
			localSettings: {
				environment: global.Environment.Verify
			},
			expected: 'verify.bg.poznan.wikia.com',
			description: 'Works for verify sub-domains with language'
		} , {
			host: 'preview.poznan.wikia.com',
			localSettings: {
				environment: global.Environment.Preview
			},
			expected: 'preview.poznan.wikia.com',
			description: 'Works for preview sub-domains'
		} , {
			host: 'preview.bg.poznan.wikia.com',
			localSettings: {
				environment: global.Environment.Preview
			},
			expected: 'preview.bg.poznan.wikia.com',
			description: 'Works for preview sub-domains with language'
		} , {
			host: 'sandbox-test.poznan.wikia.com',
			localSettings: {
				host: 'sandbox-test',
				environment: global.Environment.Sandbox
			},
			expected: 'sandbox-test.poznan.wikia.com',
			description: 'Works for sandbox sub-domains'
		} , {
			host: 'sandbox-test.bg.poznan.wikia.com',
			localSettings: {
				host: 'sandbox-test',
				environment: global.Environment.Sandbox
			},
			expected: 'sandbox-test.bg.poznan.wikia.com',
			description: 'Works for sandbox sub-domains with language'
		} , {
			host: 'bg.poznan.wikia.locals',
			localSettings: {
				wikiFallback: null,
				environment: global.Environment.Devbox,
				mediawikiHost: 'bimbo'
			},
			expected: 'community.bimbo.wikia-dev.com',
			description: 'Returns the default sub-domain if the url is wrong'
		} , {
			host: 'bg.poznan.wikia.local',
			localSettings: {
				wikiFallback: null,
				environment: global.Environment.Devbox,
				mediawikiHost: 'bimbo'
			},
			expected: 'bg.poznan.bimbo.wikia-dev.com',
			description: 'Works on .local domains'
		} , {
			host: 'bg.poznan.wikia.locals',
			localSettings: {
				wikiFallback: 'glee',
				environment: global.Environment.Devbox,
				mediawikiHost: 'bimbo'
			},
			expected: 'glee.bimbo.wikia-dev.com',
			description: 'Returns the default (from localSettings) sub-domain if the url is wrong'
		} , {
			host: '',
			localSettings: {
				environment: global.Environment.Production
			},
			expected: 'community.wikia.com',
			description: 'Returns the default domain when no domain is provided'
		}, {
			host: '',
			localSettings: {
				environment: global.Environment.Preview
			},
			expected: 'preview.community.wikia.com',
			description: 'Returns the default domain when no domain is provided on preview'
		}, {
			host: '',
			localSettings: {
				environment: global.Environment.Verify
			},
			expected: 'verify.community.wikia.com',
			description: 'Returns the default domain when no domain is provided on verify'
		}, {
			host: 'glee.wikia-local.com',
			localSettings: {
				environment: global.Environment.Devbox,
				mediawikiHost: 'evgeniy'
			},
			expected: 'glee.evgeniy.wikia-dev.com'
		}
	];

	testCases.forEach(function (testCase) {
		equal(global.getWikiDomainName(testCase.localSettings, testCase.host), testCase.expected, testCase.description);
	});
});
