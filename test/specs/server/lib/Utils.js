QUnit.module('lib/Utils');

test('getWikiName', function () {
	var testCases = [
		{
			host: 'poznan.wikia.com',
			localSettings: {
				environment: global.Environment.Prod
			},
			expected: 'poznan.wikia.com',
			description: 'Works for production sub-domains'
		}, {
			host: 'example.com',
			localSettings: {
				environment: global.Environment.Prod
			},
			expected: 'example.com',
			description: 'Custom URLs on production are passed through'
		}, {
			host: 'poznan.wikia.com',
			localSettings: {
				environment: global.Environment.Prod
			},
			expected: 'poznan.wikia.com',
			description: 'Works for production sub-domains'
		} , {
			host: 'bg.poznan.wikia.com',
			localSettings: {
				environment: global.Environment.Prod
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
				environment: global.Environment.Dev,
				devboxDomain: 'bimbo'
			},
			expected: 'community.bimbo.wikia-dev.com',
			description: 'Returns the default sub-domain if the url is wrong'
		} , {
			host: 'bg.poznan.wikia.local',
			localSettings: {
				wikiFallback: null,
				environment: global.Environment.Dev,
				devboxDomain: 'bimbo'
			},
			expected: 'bg.poznan.bimbo.wikia-dev.com',
			description: 'Works on .local domains'
		} , {
			host: 'bg.poznan.wikia.locals',
			localSettings: {
				wikiFallback: 'glee',
				environment: global.Environment.Dev,
				devboxDomain: 'bimbo'
			},
			expected: 'glee.bimbo.wikia-dev.com',
			description: 'Returns the default (from localSettings) sub-domain if the url is wrong'
		} , {
			host: '',
			localSettings: {
				environment: global.Environment.Prod
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
				environment: global.Environment.Dev,
				devboxDomain: 'evgeniy'
			},
			expected: 'glee.evgeniy.wikia-dev.com',
			description: 'Returns the devbox url if local is used'
		}, {
			localSettings: {
				environment: global.Environment.Dev,
				devboxDomain: 'test'
			},
			expected: 'community.test.wikia-dev.com',
			description: 'Returns the default sub domain if no host is provided'
		}, {
			host: 'muppet.10.10.10.145.xip.io',
			localSettings: {
				environment: global.Environment.Dev,
				devboxDomain: 'evgeniy'
			},
			expected: 'muppet.evgeniy.wikia-dev.com',
			description: 'Returns proper devbox url if xip.io sub-domain is used'

		}, {
			host: 'de.muppet.10.10.10.145.xip.io',
			localSettings: {
				environment: global.Environment.Dev,
				devboxDomain: 'evgeniy'
			},
			expected: 'de.muppet.evgeniy.wikia-dev.com',
			description: 'Returns proper devbox url if xip.io sub-domain is used'
		}
	];

	testCases.forEach(function (testCase) {
		equal(global.getWikiDomainName(testCase.localSettings, testCase.host), testCase.expected, testCase.description);
	});
});

test('clearHost', function () {
	var testCases = [
		{
			host: 'example.com',
			expected: 'example.com',
			description: 'returns the same host if no port is set'
		} , {
			host: 'example.com:8080',
			expected: 'example.com',
			description: 'clears the port from the host'
		}
	];
	testCases.forEach(function (testCase) {
		equal(global.clearHost(testCase.host), testCase.expected, testCase.description);
	});
});

test('getEnvironment', function() {
	var testCases = [
		{
			environment: 'prod',
			expected: global.Environment.Prod
		}, {
			environment: 'verify',
			expected: global.Environment.Verify
		}, {
			environment: 'preview',
			expected: global.Environment.Preview
		}, {
			environment: 'sandbox',
			expected: global.Environment.Sandbox
		}, {
			environment: 'dev',
			expected: global.Environment.Dev
		}, {
			environment: 'testing',
			expected: global.Environment.Testing
		}, {
			expected: global.Environment.Dev
		}, {
			environment: 'investing',
			default: global.Environment.Prod,
			expected: global.Environment.Prod
		}
	];
	testCases.forEach(function(testCase) {
		equal(global.getEnvironment(testCase.environment, testCase.default), testCase.expected,
			Environment[testCase.expected]);
	});
});

test('parseQueryParams', function () {
	var testCases,
		allowedKeys;
	
	testCases = [
		{foo: '1'},
		{allowed: '1'},
		{allowed: 'false'},
		{allowed: '</script>'}
	];

	allowedKeys = ['allowed'];

	equal(typeof global.parseQueryParams(testCases[0], allowedKeys).foo, 'undefined', 'Non-whitelisted parameter was passed through');
	equal(typeof global.parseQueryParams(testCases[1], allowedKeys).allowed, 'number', 'Whitelisted parameter was not passed through');
	equal(typeof global.parseQueryParams(testCases[2], allowedKeys).allowed, 'boolean', 'Whitelisted parameter was not passed through');
	equal(typeof global.parseQueryParams(testCases[3], allowedKeys).allowed, 'string', 'Whitelisted parameter was not passed through');
	equal(global.parseQueryParams(testCases[3], allowedKeys).allowed, '&lt;&#x2f;script&gt;', 'HTML in query not escaped properly');
});
