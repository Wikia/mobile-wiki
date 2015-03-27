/* global App, resetMercuryBaseline */
QUnit.module('String util functions');

QUnit.test('sanitizing title', function () {
	var string = Mercury.Utils.String,
		testCases = [
			{
				title: 'test',
				urified: 'test',
				normalized: 'test'
			}, {
				title: 'test test',
				urified: 'test_test',
				normalized: 'test test'
			}, {
				title: 'test       test',
				urified: 'test_test',
				normalized: 'test test'
			},{
				title: 'test    _ _ _   test',
				urified: 'test_test',
				normalized: 'test test'
			}, {
				title: 'test test test',
				urified: 'test_test_test',
				normalized: 'test test test'
			}, {
				title: 'test test  test',
				urified: 'test_test_test',
				normalized: 'test test test'
			}, {
				title: 'test test_test',
				urified: 'test_test_test',
				normalized: 'test test test'
			}, {
				title: 'test test/test',
				urified: 'test_test/test',
				normalized: 'test test/test'
			}, {
				title: 'test test/test/test test',
				urified: 'test_test/test/test_test',
				normalized: 'test test/test/test test'
			}, {
				title: 'test test/test//test',
				urified: 'test_test/test//test',
				normalized: 'test test/test//test'
			}
		];

	testCases.forEach(function(testCase) {
		equal(string.titleToUri(testCase.title), testCase.urified);
	});

	testCases.forEach(function(testCase) {
		equal(string.normalize(testCase.title), testCase.normalized);
	});
});
