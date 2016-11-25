var sinon = require('sinon');

QUnit.module('lib/utils');

QUnit.test('getWikiName', function (assert) {
	var testCases = [
		{
			host: 'poznan.wikia.com',
			settings: {
				environment: global.environment.prod
			},
			expected: 'poznan.wikia.com',
			description: 'Works for production sub-domains'
		},
		{
			host: 'example.com',
			settings: {
				environment: global.environment.prod
			},
			expected: 'example.com',
			description: 'Custom URLs on production are passed through'
		},
		{
			host: 'bg.poznan.wikia.com',
			settings: {
				environment: global.environment.prod
			},
			expected: 'bg.poznan.wikia.com',
			description: 'Works for production sub-domains with language'
		},
		{
			host: 'verify.poznan.wikia.com',
			settings: {
				environment: global.environment.verify
			},
			expected: 'verify.poznan.wikia.com',
			description: 'Works for verify sub-domains'
		},
		{
			host: 'verify.bg.poznan.wikia.com',
			settings: {
				environment: global.environment.verify
			},
			expected: 'verify.bg.poznan.wikia.com',
			description: 'Works for verify sub-domains with language'
		},
		{
			host: 'preview.poznan.wikia.com',
			settings: {
				environment: global.environment.preview
			},
			expected: 'preview.poznan.wikia.com',
			description: 'Works for preview sub-domains'
		},
		{
			host: 'preview.bg.poznan.wikia.com',
			settings: {
				environment: global.environment.preview
			},
			expected: 'preview.bg.poznan.wikia.com',
			description: 'Works for preview sub-domains with language'
		},
		{
			host: 'stable.poznan.wikia.com',
			settings: {
				environment: global.environment.stable
			},
			expected: 'stable.poznan.wikia.com',
			description: 'Works for stable sub-domains'
		},
		{
			host: 'stable.bg.poznan.wikia.com',
			settings: {
				environment: global.environment.stable
			},
			expected: 'stable.bg.poznan.wikia.com',
			description: 'Works for stable sub-domains with language'
		},
		{
			host: 'sandbox-test.poznan.wikia.com',
			settings: {
				host: 'sandbox-test',
				environment: global.environment.sandbox
			},
			expected: 'sandbox-test.poznan.wikia.com',
			description: 'Works for sandbox sub-domains'
		},
		{
			host: 'sandbox-test.bg.poznan.wikia.com',
			settings: {
				environment: global.environment.sandbox
			},
			expected: 'sandbox-test.bg.poznan.wikia.com',
			description: 'Works for sandbox sub-domains with language'
		},
		{
			host: 'poznan.wikia-staging.com',
			settings: {
				host: 'poznan.wikia-staging.com',
				environment: global.environment.staging
			},
			expected: 'sandbox-test.poznan.wikia.com',
			description: 'Works for staging domains'
		},
		{
			host: 'pl.poznan.wikia-staging.com',
			settings: {
				environment: global.environment.staging
			},
			expected: 'pl.poznan.wikia-staging.com',
			description: 'Works for staging domains with language'
		},
		{
			host: 'muppet.10.10.10.145.xip.io',
			settings: {
				environment: global.environment.dev,
				devboxDomain: 'evgeniy'
			},
			expected: 'muppet.evgeniy.wikia-dev.com',
			description: 'Returns proper devbox url if xip.io sub-domain is used'

		},
		{
			host: 'de.muppet.10.10.10.145.xip.io',
			settings: {
				environment: global.environment.dev,
				devboxDomain: 'evgeniy'
			},
			expected: 'de.muppet.evgeniy.wikia-dev.com',
			description: 'Returns proper devbox url if xip.io sub-domain is used with language'
		}
	];

	testCases.forEach(function (testCase) {
		assert.equal(global.getWikiDomainName(testCase.settings, testCase.host),
			testCase.expected, testCase.description);
	});
});

QUnit.test('getWikiaSubdomain', function (assert) {
	var testCases = [
		{
			host: 'glee.wikia.com',
			expected: 'glee',
			description: 'Works for production sub-domains'
		},
		{
			host: 'bg.poznan.wikia.com',
			expected: 'bg.poznan',
			description: 'Works for production sub-domains with language'
		},
		{
			host: 'verify.poznan.wikia.com',
			expected: 'poznan',
			description: 'Works for verify sub-domains'
		},
		{
			host: 'verify.bg.poznan.wikia.com',
			expected: 'bg.poznan',
			description: 'Works for verify sub-domains with language'
		},
		{
			host: 'preview.poznan.wikia.com',
			expected: 'poznan',
			description: 'Works for preview sub-domains'
		},
		{
			host: 'preview.bg.muppet.wikia.com',
			expected: 'bg.muppet',
			description: 'Works for preview sub-domains with language'
		},
		{
			host: 'stable.poznan.wikia.com',
			expected: 'poznan',
			description: 'Works for stable sub-domains'
		},
		{
			host: 'stable.bg.muppet.wikia.com',
			expected: 'bg.muppet',
			description: 'Works for stable sub-domains with language'
		},
		{
			host: 'sandbox-test.chess.wikia.com',
			expected: 'chess',
			description: 'Works for sandbox sub-domains'
		},
		{
			host: 'sandbox-test.ja.starwars.armon.wikia-dev.com',
			expected: 'ja.starwars',
			description: 'Works for sandbox sub-domains with language'
		},
		{
			host: 'chess.wikia-staging.com',
			expected: 'chess',
			description: 'Works for staging domains'
		},
		{
			host: 'ja.starwars.wikia-staging.com',
			expected: 'ja.starwars',
			description: 'Works for staging domains with language'
		}
	];

	testCases.forEach(function (testCase) {
		assert.equal(global.getWikiaSubdomain(testCase.host), testCase.expected, testCase.description);
	});
});

QUnit.test('clearHost', function (assert) {
	var testCases = [
		{
			host: 'example.com',
			expected: 'example.com',
			description: 'returns the same host if no port is set'
		},
		{
			host: 'example.com:8080',
			expected: 'example.com',
			description: 'clears the port from the host'
		},
		{
			host: 'externaltest.muppet.wikia.com',
			expected: 'muppet.wikia.com',
			description: 'clears the externaltest ad domain alias'
		},
		{
			host: 'showcase.muppet.wikia.com',
			expected: 'muppet.wikia.com',
			description: 'clears the showcase ad domain alias'
		},
		{
			host: 'externaltest.muppet.wikia.com:8000',
			expected: 'muppet.wikia.com',
			description: 'clears the showcase ad domain alias and port'
		},
		{
			host: 'muppet.wikia-staging.com:8000',
			expected: 'muppet.wikia-staging.com',
			description: 'clears a port from staging'
		}
	];

	testCases.forEach(function (testCase) {
		assert.equal(global.clearHost(testCase.host), testCase.expected, testCase.description);
	});
});

QUnit.test('getEnvironment', function (assert) {
	var testCases = [
		{
			environment: 'prod',
			expected: global.environment.prod
		},
		{
			environment: 'verify',
			expected: global.environment.verify
		},
		{
			environment: 'preview',
			expected: global.environment.preview
		},
		{
			environment: 'stable',
			expected: global.environment.stable
		},
		{
			environment: 'sandbox',
			expected: global.environment.sandbox
		},
		{
			environment: 'dev',
			expected: global.environment.dev
		},
		{
			environment: 'testing',
			expected: global.environment.testing
		},
		{
			environment: 'staging',
			expected: global.environment.staging
		},
		{
			expected: global.environment.dev
		},
		{
			environment: 'investing',
			default: global.environment.prod,
			expected: global.environment.prod
		}
	];

	testCases.forEach(function (testCase) {
		assert.equal(global.getEnvironment(testCase.environment, testCase.default), testCase.expected,
			global.Environment[testCase.expected]);
	});
});

QUnit.test('parseQueryParams', function (assert) {
	var testCases,
		allowedKeys;

	testCases = [
		{foo: '1'},
		{allowed: 1},
		{allowed: 'false'},
		{allowed: '</script>'}
	];

	allowedKeys = ['allowed'];

	assert.equal(typeof global.parseQueryParams(testCases[0], allowedKeys).foo, 'undefined',
		'Non-whitelisted parameter was passed through');
	assert.equal(typeof global.parseQueryParams(testCases[1], allowedKeys).allowed, 'number',
		'Whitelisted parameter was not passed through');
	assert.equal(typeof global.parseQueryParams(testCases[2], allowedKeys).allowed, 'boolean',
		'Whitelisted parameter was not passed through');
	assert.equal(typeof global.parseQueryParams(testCases[3], allowedKeys).allowed, 'string',
		'Whitelisted parameter was not passed through');
	assert.equal(global.parseQueryParams(testCases[3], allowedKeys).allowed, '&lt;&#x2f;script&gt;',
		'HTML in query not escaped properly');
});

QUnit.test('isXipHost', function (assert) {
	var testCases = [
		{
			environment: global.Environment.Dev,
			hostName: 'muppet.127.0.0.1.xip.io',
			expected: true
		},
		{
			environment: global.Environment.Dev,
			hostName: 'muppet.igor.wikia-dev.com',
			expected: false
		},
		{
			environment: global.Environment.Prod,
			hostName: 'muppet.127.0.0.1.xip.io',
			expected: false
		},
		{
			environment: global.Environment.Dev,
			hostName: 'muppet.xip.io',
			expected: false
		},
		{
			environment: global.Environment.Dev,
			hostName: 'xip.io.wikia.com',
			expected: false
		}
	];

	testCases.forEach(function (testCase) {
		assert.equal(global.isXipHost({environment: testCase.environment}, testCase.hostName), testCase.expected);
	});
});

QUnit.test('redirectToCanonicalHostIfNeeded', function (assert) {
	var reply,
		permanentMock = function () {
			return true;
		},
		testCases = [
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
				settings: {
					environment: global.Environment.Prod
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
				settings: {
					environment: global.Environment.Prod
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
				settings: {
					environment: global.Environment.Dev
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
				settings: {
					environment: global.Environment.Dev
				},
				expected: {
					redirected: true,
					redirectLocation: 'http://starwars.igor.wikia-dev.com/wiki/Yoda?noads=1'
				}
			}
		],
		assertionsExpected = testCases.length;

	testCases.forEach(function (testCase) {
		if (testCase.expected.redirected === true) {
			assertionsExpected++;

			reply = {
				redirect: function (redirectLocation) {
					assert.equal(testCase.expected.redirectLocation, redirectLocation, 'Redirected to correct location');
					return {
						permanent: permanentMock
					};
				}
			};

			throws(
				function () {
					global.redirectToCanonicalHostIfNeeded(testCase.settings, testCase.request,
						reply, testCase.wikiVariables);
				},
				global.RedirectedToCanonicalHost,
				'No redirection when needed'
			);

			reply = null;
		} else {
			try {
				global.redirectToCanonicalHostIfNeeded(testCase.settings, testCase.request,
					reply, testCase.wikiVariables);
				assert.ok(true);
			} catch (e) {
				assert.ok(false, 'Redirection when not needed');
			}
		}
	});
});

QUnit.test('redirectToOasis', function (assert) {
	var testCases = [
		{
			pathname: '/wiki/Yoda',
			query: {},
			expected: '/wiki/Yoda?useskin=oasis'
		},
		{
			pathname: '/wiki/Yoda',
			query: {
				test: 1
			},
			expected: '/wiki/Yoda?test=1&useskin=oasis'
		},
		{
			pathname: '/wiki/Yoda',
			query: {
				useskin: 'monobook'
			},
			expected: '/wiki/Yoda?useskin=oasis'
		}
	];

	testCases.forEach(function (testCase) {
		var redirectStub = sinon.stub();

		global.redirectToOasis({
			url: {
				pathname: testCase.pathname
			},
			query: testCase.query
		}, {
			redirect: redirectStub
		});

		assert.ok(redirectStub.calledWith(testCase.expected));
	});
});

QUnit.test('getCorporatePageUrlFromWikiDomain', function (assert) {
	var testCases = [
		{
			wikiDomain: 'poznan.wikia.com',
			environment: global.Environment.Prod,
			expected: 'www.wikia.com'
		},
		{
			wikiDomain: 'pl.gta.wikia.com',
			environment: global.Environment.Prod,
			expected: 'www.wikia.com'
		},
		{
			wikiDomain: 'www.wikia.com',
			environment: global.Environment.Prod,
			expected: 'www.wikia.com'
		},
		{
			wikiDomain: 'preview.poznan.wikia.com',
			environment: global.Environment.Preview,
			expected: 'preview.www.wikia.com'
		},
		{
			wikiDomain: 'preview.pl.gta.wikia.com',
			environment: global.Environment.Preview,
			expected: 'preview.www.wikia.com'
		},
		{
			wikiDomain: 'poznan.hacker.wikia-dev.com',
			environment: global.Environment.Dev,
			expected: 'www.hacker.wikia-dev.com'
		},
		{
			wikiDomain: 'pl.gta.hacker.wikia-dev.com',
			environment: global.Environment.Dev,
			expected: 'www.hacker.wikia-dev.com'
		}
	];

	testCases.forEach(function (testCase) {
		const settings = {
			environment: testCase.environment,
			devboxDomain: 'hacker'
		};

		assert.equal(global.getCorporatePageUrlFromWikiDomain(settings, testCase.wikiDomain), testCase.expected);
	});
});
