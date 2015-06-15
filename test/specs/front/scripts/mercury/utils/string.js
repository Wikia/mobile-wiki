/* global App, resetMercuryBaseline */
QUnit.module('String util functions');

QUnit.test('sanitizing title', function () {
	var string = Mercury.Utils.String,
		testCases = [
			{
				title: 'test',
				normalize: 'test'
			}, {
				title: 'test test',
				normalize: 'test test'
			}, {
				title: 'test       test',
				normalize: 'test test'
			},{
				title: 'test    _ _ _   test',
				normalize: 'test test'
			}, {
				title: 'test test test',
				normalize: 'test test test'
			}, {
				title: 'test test  test',
				normalize: 'test test test'
			}, {
				title: 'test test_test',
				normalize: 'test test test'
			}, {
				title: 'test test/test',
				normalize: 'test test/test'
			}, {
				title: 'test test/test/test test',
				normalize: 'test test/test/test test'
			}, {
				title: 'test test/test//test',
				normalize: 'test test/test//test'
			}
		];

	testCases.forEach(function(testCase) {
		equal(string.normalize(testCase.title), testCase.normalize);
	});
});
