QUnit.module('lib/Caching');

function newRequest(statusCode) {
	var statusCode = statusCode,
		headers = {},
		setHeader = function (key, value) {
			headers[key] = value;
		},
		getHeaders = function () {
			return headers;
		};
	return {
		header: setHeader,
		getHeaders: getHeaders,
		statusCode: statusCode
	}
}

test('policyString works', function () {
	var testCases = [
		{
			given: Policy.Private,
			expected: 'private'
		}, {
			given: Policy.Public,
			expected: 'public'
		}
	];
	testCases.forEach(function (testCase) {
		equal(policyString(testCase.given), testCase.expected, Policy[testCase.given]);
	});
});

// Ported mostly from https://github.com/Wikia/app/blob/dev/includes/wikia/tests/WikiaResponseTest.php#L174
test('setResponseCaching works', function () {
	var testCases = [
		{
			statusCode: 200,
			given: {
				enabled: true,
				cachingPolicy: Policy.Public,
				varnishTTL: Interval.disabled,
				browserTTL: Interval.disabled
			},
			expected: {
				'Cache-Control': 's-maxage=5'
			},
			description: 'no caching, but Varnish would still cache it for 5 seconds'
		}, {
			statusCode: 200,
			given: {
				enabled: true,
				cachingPolicy: Policy.Public,
				varnishTTL: Interval.short,
				browserTTL: Interval.disabled
			},
			expected: {
				'Cache-Control': 's-maxage=10800'
			},
			description: 'cache on Varnish only'
		}, {
			statusCode: 200,
			given: {
				enabled: true,
				cachingPolicy: Policy.Public,
				varnishTTL: Interval.short,
				browserTTL: Interval.default
			},
			expected: {
				'Cache-Control': 's-maxage=10800',
				'X-Pass-Cache-Control': 'public, max-age=10800'
			},
			description: 'cache on both'
		}, {
			statusCode: 200,
			given: {
				enabled: true,
				cachingPolicy: Policy.Public,
				varnishTTL: Interval.standard,
				browserTTL: Interval.short
			},
			expected: {
				'Cache-Control': 's-maxage=86400',
				'X-Pass-Cache-Control': 'public, max-age=10800'
			},
			description: 'cache on both (different TTLs)'
		}, {
			statusCode: 200,
			given: {
				enabled: true,
				cachingPolicy: Policy.Private,
				varnishTTL: Interval.disabled,
				browserTTL: Interval.default
			},
			expected: {
				'Cache-Control': 'private, s-maxage=0'
			},
			description: 'Varnish caching disabled, private caching'
		}, {
			statusCode: 200,
			given: {
				enabled: true,
				cachingPolicy: Policy.Private,
				varnishTTL: Interval.disabled,
				browserTTL: Interval.standard
			},
			expected: {
				'Cache-Control': 'private, s-maxage=0',
				'X-Pass-Cache-Control': 'private, max-age=86400'
			},
			description: 'only private caching'
		}, {
			statusCode: 200,
			given: {
				enabled: false,
				cachingPolicy: Policy.Private,
				varnishTTL: Interval.disabled,
				browserTTL: Interval.standard
			},
			expected: {},
			description: 'can be disabled'
		}, {
			statusCode: 404,
			given: {
				enabled: false,
				cachingPolicy: Policy.Private,
				varnishTTL: Interval.disabled,
				browserTTL: Interval.standard
			},
			expected: {},
			description: 'id disabled on non 200 response code'
		}
	];
	testCases.forEach(function (testCase) {
		var request = newRequest(testCase.statusCode);
		setResponseCaching(request, testCase.given);
		deepEqual(request.getHeaders(), testCase.expected, testCase.description);
	});
});
