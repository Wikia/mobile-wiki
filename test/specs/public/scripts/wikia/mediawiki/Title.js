/* global App, resetWikiaBaseline */
QUnit.module('Title class');

QUnit.test('sanitizing URL', function () {
	var Title = Wikia.Title,
		testCases = [
			{
				title: 'test',
				sanitized: 'test',
				normalized: 'test'
			}, {
				title: 'test test',
				sanitized: 'test_test',
				normalized: 'test test'
			}, {
				title: 'test       test',
				sanitized: 'test_test',
				normalized: 'test test'
			},{
				title: 'test    _ _ _   test',
				sanitized: 'test_test',
				normalized: 'test test'
			}, {
				title: 'test test test',
				sanitized: 'test_test_test',
				normalized: 'test test test'
			}, {
				title: 'test test  test',
				sanitized: 'test_test_test',
				normalized: 'test test test'
			}, {
				title: 'test test_test',
				sanitized: 'test_test_test',
				normalized: 'test test test'
			}, {
				title: 'test test/test',
				sanitized: 'test_test/test',
				normalized: 'test test/test'
			}, {
				title: 'test test/test/test test',
				sanitized: 'test_test/test/test_test',
				normalized: 'test test/test/test test'
			}, {
				title: 'test test/test//test',
				sanitized: 'test_test/test//test',
				normalized: 'test test/test//test'
			}
		];

	testCases.forEach(function(testCase) {
		equal(Title.sanitize(testCase.title), testCase.sanitized);
	});

	testCases.forEach(function(testCase) {
		equal(Title.normalize(testCase.title), testCase.normalized);
	});
});
