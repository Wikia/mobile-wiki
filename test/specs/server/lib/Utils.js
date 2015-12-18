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
				environment: global.Environment.Sandbox
			},
			expected: 'sandbox-test.bg.poznan.wikia.com',
			description: 'Works for sandbox sub-domains with language'
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
			description: 'Returns proper devbox url if xip.io sub-domain is used with language'
		}
	];

	testCases.forEach(function (testCase) {
		equal(global.getWikiDomainName(testCase.localSettings, testCase.host), testCase.expected, testCase.description);
	});
});

test('getWikiaSubdomain', function () {
	var testCases = [
		{
			host: 'glee.wikia.com',
			expected: 'glee',
			description: 'Works for production sub-domains'
		}, {
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
			host: 'preview.bg.muppet.wikia.com',
			expected: 'bg.muppet',
			description: 'Works for preview sub-domains with language'
		} , {
			host: 'sandbox-test.chess.wikia.com',
			expected: 'chess',
			description: 'Works for sandbox sub-domains'
		} , {
			host: 'sandbox-test.ja.starwars.armon.wikia-dev.com',
			expected: 'ja.starwars',
			description: 'Works for sandbox sub-domains with language'
		}
	];

	testCases.forEach(function (testCase) {
		equal(global.getWikiaSubdomain(testCase.host), testCase.expected, testCase.description);
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
		} , {
			host: 'externaltest.muppet.wikia.com',
			expected: 'muppet.wikia.com',
			description: 'clears the externaltest ad domain alias'
		} , {
			host: 'showcase.muppet.wikia.com',
			expected: 'muppet.wikia.com',
			description: 'clears the showcase ad domain alias'
		} , {
			host: 'externaltest.muppet.wikia.com:8000',
			expected: 'muppet.wikia.com',
			description: 'clears the showcase ad domain alias and port'
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
		{allowed: 1},
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

test('isXipHost', function () {
	var testCases = [
		{
			environment: Environment.Dev,
			hostName: 'muppet.127.0.0.1.xip.io',
			expected: true
		},
		{
			environment: Environment.Dev,
			hostName: 'muppet.igor.wikia-dev.com',
			expected: false
		},
		{
			environment: Environment.Prod,
			hostName: 'muppet.127.0.0.1.xip.io',
			expected: false
		},
		{
			environment: Environment.Dev,
			hostName: 'muppet.xip.io',
			expected: false
		},
		{
			environment: Environment.Dev,
			hostName: 'xip.io.wikia.com',
			expected: false
		}
	];

	testCases.forEach(function (testCase) {
		equal(global.isXipHost({environment: testCase.environment}, testCase.hostName), testCase.expected);
	});
});

test('redirectToCanonicalHostIfNeeded', function () {
	var testCases = [
			{
				request: {
					headers: {
						host: 'www.starwars.wikia.com'
					},
					path: '/wiki/Yoda',
					query: {}
				},
				wikiVariables: {
					basePath: 'http://starwars.wikia.com'
				},
				localSettings: {
					environment: Environment.Prod
				},
				expected: {
					redirected: true,
					redirectLocation: 'http://starwars.wikia.com/wiki/Yoda'
				}
			},
			{
				request: {
					headers: {
						host: 'starwars.wikia.com'
					},
					path: '/wiki/Yoda',
					query: {}
				},
				wikiVariables: {
					basePath: 'http://starwars.wikia.com'
				},
				localSettings: {
					environment: Environment.Prod
				},
				expected: {
					redirected: false
				}
			},
			{
				request: {
					headers: {
						host: 'starwars.127.0.0.1.xip.io:8000'
					},
					path: '/wiki/Yoda',
					query: {}
				},
				wikiVariables: {
					basePath: 'http://starwars.igor.wikia-dev.com'
				},
				localSettings: {
					environment: Environment.Dev
				},
				expected: {
					redirected: false
				}
			},
			{
				request: {
					headers: {
						host: 'www.starwars.igor.wikia-dev.com'
					},
					path: '/wiki/Yoda',
					query: {
						noads: 1
					}
				},
				wikiVariables: {
					basePath: 'http://starwars.igor.wikia-dev.com'
				},
				localSettings: {
					environment: Environment.Dev
				},
				expected: {
					redirected: true,
					redirectLocation: 'http://starwars.igor.wikia-dev.com/wiki/Yoda?noads=1'
				}
			}
		],
		// Haven't found a way to integrate sinon-qunit into node-qunit
		// Because of that we can't spy the reply in a clean way and must hack around
		reply,
		permanentMock = function () {
			return true;
		},
		assertionsExpected = testCases.length;

	testCases.forEach(function (testCase) {
		if (testCase.expected.redirected === true) {
			assertionsExpected++;

			reply = {
				redirect: function (redirectLocation) {
					equal(testCase.expected.redirectLocation, redirectLocation, 'Redirected to correct location');
					return {
						permanent: permanentMock
					};
				}
			};

			throws(
				function () {
					global.redirectToCanonicalHostIfNeeded(testCase.localSettings, testCase.request, reply, testCase.wikiVariables)
				},
				global.RedirectedToCanonicalHost,
				'No redirection when needed'
			);

			reply = null;
		} else {
			try {
				global.redirectToCanonicalHostIfNeeded(testCase.localSettings, testCase.request, reply, testCase.wikiVariables);
				ok(true);
			} catch (e) {
				ok(false, 'Redirection when not needed');
			}
		}
	});

	expect(assertionsExpected);
});

test('getHtmlTitle', function () {
	var testCases = [
		{
			htmlTitleTemplate: '$1 - Muppet Wiki - Wikia',
			displayTitle: 'Kermit the Frog',
			expected: 'Kermit the Frog - Muppet Wiki - Wikia'
		},
		{
			htmlTitleTemplate: '$1 - Muppet Wiki - Wikia',
			displayTitle: 'test title',
			expected: 'test title - Muppet Wiki - Wikia'
		},
		{
			htmlTitleTemplate: '$1 - Muppet Wiki - Wikia',
			displayTitle: '',
			expected: 'Muppet Wiki - Wikia'
		},
		{
			htmlTitleTemplate: 'sandbox - $1 - Muppet Wiki - Wikia',
			displayTitle: '',
			expected: 'sandbox - Muppet Wiki - Wikia'
		},
		{
			htmlTitleTemplate: '$1 - Wikia',
			displayTitle: '',
			expected: 'Wikia'
		},
	];

	testCases.forEach(function (testCase) {
		equal(global.getHtmlTitle({htmlTitleTemplate: testCase.htmlTitleTemplate}, testCase.displayTitle), testCase.expected);
	});
});
