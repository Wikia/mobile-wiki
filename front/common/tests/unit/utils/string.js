QUnit.module('mercury/utils/string', function () {
	QUnit.test('sanitizing title', function (assert) {
		var string = require('common/utils/string'),
			testCases = [
				{
					title: 'test',
					normalize: 'test'
				},
				{
					title: 'test test',
					normalize: 'test test'
				},
				{
					title: 'test       test',
					normalize: 'test test'
				},
				{
					title: 'test    _ _ _   test',
					normalize: 'test test'
				},
				{
					title: 'test test test',
					normalize: 'test test test'
				},
				{
					title: 'test test  test',
					normalize: 'test test test'
				},
				{
					title: 'test test_test',
					normalize: 'test test test'
				},
				{
					title: 'test test/test',
					normalize: 'test test/test'
				},
				{
					title: 'test test/test/test test',
					normalize: 'test test/test/test test'
				},
				{
					title: 'test test/test//test',
					normalize: 'test test/test//test'
				}
			];

		testCases.forEach(function (testCase) {
			assert.equal(string.normalizeToWhitespace(testCase.title), testCase.normalize);
		});
	});

	QUnit.test('getLastUrlFromText properly extracts last url from a block of text', function (assert) {
		const string = require('common/utils/string'),
			testCases = [
				{
					blockOfText: 'http://fandom.wikia.com',
					expected: 'http://fandom.wikia.com'
				},
				{
					blockOfText: 'http://fandom.wikia.com http://fallout.wikia.com/wiki/Page',
					expected: 'http://fallout.wikia.com/wiki/Page'
				},
				{
					blockOfText: 'There is a text before https://services.wikia.com/discussion and after the url.',
					expected: 'https://services.wikia.com/discussion'
				},
				{
					blockOfText: 'There is no url here.',
					expected: null
				},
			];

		testCases.forEach(function (testCase) {
			assert.equal(string.getLastUrlFromText(testCase.blockOfText), testCase.expected);
		});
	});
});
