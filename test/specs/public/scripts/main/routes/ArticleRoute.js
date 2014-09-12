/* global App, resetWikiaBaseline */
moduleFor('route:article', 'Article Route');

test('sanitizing URL', function () {
	var route = this.subject(),
		testCases = [
			{
				path: 'test',
				sanitized: 'test'
			}, {
				path: 'test test',
				sanitized: 'test_test'
			}, {
				path: 'test       test',
				sanitized: 'test_test'
			},{
				path: 'test    _ _ _   test',
				sanitized: 'test_test'
			}, {
				path: 'test test test',
				sanitized: 'test_test_test'
			}, {
				path: 'test test  test',
				sanitized: 'test_test_test'
			}, {
				path: 'test test_test',
				sanitized: 'test_test_test'
			}, {
				path: 'test test/test',
				sanitized: 'test_test/test'
			}, {
				path: 'test test/test/test test',
				sanitized: 'test_test/test/test_test'
			}, {
				path: 'test test/test//test',
				sanitized: 'test_test/test//test'
			}
		];

	expect(testCases.length);

	testCases.forEach(function(testCase) {
		equal(route.sanitizeURL(testCase.path), testCase.sanitized);
	});
});
