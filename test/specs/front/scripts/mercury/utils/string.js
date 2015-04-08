/* global App, resetMercuryBaseline */
QUnit.module('String util functions');

QUnit.test('sanitizing title', function () {
	var string = Mercury.Utils.String,
		testCases = [
			{
				title: 'test',
				titleToUri: 'test',
				normalize: 'test'
			}, {
				title: 'test test',
				titleToUri: 'test_test',
				normalize: 'test test'
			}, {
				title: 'test       test',
				titleToUri: 'test_test',
				normalize: 'test test'
			},{
				title: 'test    _ _ _   test',
				titleToUri: 'test_test',
				normalize: 'test test'
			}, {
				title: 'test test test',
				titleToUri: 'test_test_test',
				normalize: 'test test test'
			}, {
				title: 'test test  test',
				titleToUri: 'test_test_test',
				normalize: 'test test test'
			}, {
				title: 'test test_test',
				titleToUri: 'test_test_test',
				normalize: 'test test test'
			}, {
				title: 'test test/test',
				titleToUri: 'test_test/test',
				normalize: 'test test/test'
			}, {
				title: 'test test/test/test test',
				titleToUri: 'test_test/test/test_test',
				normalize: 'test test/test/test test'
			}, {
				title: 'test test/test//test',
				titleToUri: 'test_test/test//test',
				normalize: 'test test/test//test'
			}
		];

	testCases.forEach(function(testCase) {
		equal(string.titleToUri(testCase.title), testCase.titleToUri);
	});

	testCases.forEach(function(testCase) {
		equal(string.normalize(testCase.title), testCase.normalize);
	});
});
