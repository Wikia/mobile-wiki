QUnit.module('auth/common/UrlHelper', function () {
	QUnit.test('UrlHelper is loaded', function (assert) {
		assert.ok(typeof mrequire('auth/common/UrlHelper').default === 'function');
	});

	QUnit.test('UrlHelper urlEncode', function (assert) {
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
				urlHelperClass = mrequire('auth/common/UrlHelper').default,
				urlHelper = new urlHelperClass();

		testCases.forEach(function(testCase) {
			assert.equal(urlHelper.urlEncode(testCase.input), testCase.expected);
		});
	});


	QUnit.test('UrlHelper ulrDecode', function (assert) {
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
				urlHelperClass = mrequire('auth/common/UrlHelper').default,
				urlHelper = new urlHelperClass();

		testCases.forEach(function(testCase) {
			assert.deepEqual(urlHelper.urlDecode(testCase.input), testCase.expected);
		});
	});

});
