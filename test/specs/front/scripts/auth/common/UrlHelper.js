QUnit.module('auth/common/UrlHelper)');

QUnit.test('UrlHelper is loaded', function () {
	ok(typeof window.UrlHelper === 'function');
});

QUnit.test('UrlHelper urlEncode', function () {
	var testCases = [
			{
				input: {},
				expected: ''
			},
			{
				input: {
					foo: 'bar'
				},
				expected: 'foo=bar'
			},
			{
				input: {
					foo: '/bar'
				},
				expected: 'foo=%2Fbar'
			},
			{
				input: {
					foo: '',
					bar: 'http://example.com/',
					baz: 'some string'
				},
				expected: 'foo=&bar=http%3A%2F%2Fexample.com%2F&baz=some%20string'
			}
		],
		urlHelper = new UrlHelper();

	testCases.forEach(function(testCase) {
		equal(urlHelper.urlEncode(testCase.input), testCase.expected);
	});
});


QUnit.test('UrlHelper ulrDecode', function () {
	var testCases = [
			{
				input: 'foo=bar',
				expected: {
					foo: 'bar'
				}
			},
			{
				input: 'foo=%2Fbar',
				expected: {
					foo: '/bar'
				}
			},
			{
				input: 'foo=&bar=http%3A%2F%2Fexample.com%2F&baz=some%20string',
				expected: {
					foo: '',
					bar: 'http://example.com/',
					baz: 'some string'
				}
			}
		],
		urlHelper = new UrlHelper();

	testCases.forEach(function(testCase) {
		deepEqual(urlHelper.urlDecode(testCase.input), testCase.expected);
	});
});
