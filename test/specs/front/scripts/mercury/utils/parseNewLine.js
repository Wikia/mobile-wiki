QUnit.module('mercury/utils/parseNewLine', function () {
	QUnit.test('Trimming text and parsing new lines.', function (assert) {
		const test = require('mercury/utils/parseNewLine'),
			testCases = [
				{
					title: 'Trimming test',
					string: '\r\n\nSuperString\n\r\n',
					expected: 'SuperString'
				}, {
					title: 'Parsing new lines',
					string: '1stLine\n\n2ndline',
					expected: '1stLine<br><br>2ndline'
				}, {
					title: 'All together',
					string: '\r\n1stLine\n2ndLine\n\n3rdLine\r\n\n',
					expected: '1stLine<br>2ndLine<br><br>3rdLine'
				}
			];

		testCases.forEach(function(testCase) {
			assert.equal(test.parseNewLine(testCase.string), testCase.expected);
		});
	});
});
