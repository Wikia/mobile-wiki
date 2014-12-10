QUnit.module('lib/Caching');

function newRequest(statusCode) {
	var headers = {},
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
	};
}

test('policyString works', function () {
	var testCases = [
		{
			given: global.Policy.Private,
			expected: 'private'
		}, {
			given: global.Policy.Public,
			expected: 'public'
		}
	];
	testCases.forEach(function (testCase) {
		equal(global.policyString(testCase.given), testCase.expected, global.Policy[testCase.given]);
	});
});

// Ported mostly from https://github.com/Wikia/app/blob/dev/includes/wikia/tests/WikiaResponseTest.php#L174
test('setResponseCaching works', function () {
	var testCases = [
		{
			statusCode: 200,
			given: {
				enabled: true,
				cachingPolicy: global.Policy.Public,
				varnishTTL: global.Interval.disabled,
				browserTTL: global.Interval.disabled
			},
			expected: {
				'Cache-Control': 's-maxage=5'
			},
			description: 'no caching, but Varnish would still cache it for 5 seconds'
		}, {
			statusCode: 200,
			given: {
				enabled: true,
				cachingPolicy: global.Policy.Public,
				varnishTTL: global.Interval.short,
				browserTTL: global.Interval.disabled
			},
			expected: {
				'Cache-Control': 's-maxage=10800'
			},
			description: 'cache on Varnish only'
		}, {
			statusCode: 200,
			given: {
				enabled: true,
				cachingPolicy: global.Policy.Public,
				varnishTTL: global.Interval.short,
				browserTTL: global.Interval.default
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
				cachingPolicy: global.Policy.Public,
				varnishTTL: global.Interval.standard,
				browserTTL: global.Interval.short
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
				cachingPolicy: global.Policy.Private,
				varnishTTL: global.Interval.disabled,
				browserTTL: global.Interval.default
			},
			expected: {
				'Cache-Control': 'private, s-maxage=0'
			},
			description: 'Varnish caching disabled, private caching'
		}, {
			statusCode: 200,
			given: {
				enabled: true,
				cachingPolicy: global.Policy.Private,
				varnishTTL: global.Interval.disabled,
				browserTTL: global.Interval.standard
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
				cachingPolicy: global.Policy.Private,
				varnishTTL: global.Interval.disabled,
				browserTTL: global.Interval.standard
			},
			expected: {},
			description: 'can be disabled'
		}, {
			statusCode: 404,
			given: {
				enabled: false,
				cachingPolicy: global.Policy.Private,
				varnishTTL: global.Interval.disabled,
				browserTTL: global.Interval.standard
			},
			expected: {},
			description: 'is disabled on non 200 response code'
		}, {
			statusCode: 200,
			given: {
				enabled: true,
				cachingPolicy: global.Policy.Public,
				varnishTTL: global.Interval.standard,
				browserTTL: global.Interval.default
			},
			expected: {
				'Cache-Control': 's-maxage=86400',
				'X-Pass-Cache-Control': 'public, max-age=86400'
			},
			description: 'default article caching'
		}
	];
	testCases.forEach(function (testCase) {
		var request = newRequest(testCase.statusCode);
		global.setResponseCaching(request, testCase.given);
		deepEqual(request.getHeaders(), testCase.expected, testCase.description);
	});
});
