QUnit.module('mercury/utils/nl2br', function () {
	QUnit.test('Trimming text and parsing new lines.', function (assert) {
		const test = mrequire('mercury/utils/nl2br').default,
			testCases = [
				{
					title: 'Parsing nl',
					string: '\nSuper\n\n\nString\n',
					expected: '<br>Super<br><br><br>String<br>'
				}, {
					title: 'Parsing cr',
					string: '1stLine\r\r2ndline',
					expected: '1stLine<br><br>2ndline'
				}, {
					title: 'Parsing nlcr',
					string: '\r\n1stLine\r\n2ndLine\r\n3rdLine\r\n\r\n',
					expected: '<br>1stLine<br>2ndLine<br>3rdLine<br><br>'
				}, {
					title: 'All together',
					string: '\n2ndLine\r\n\n3rdLine\r\n\r',
					expected: '<br>2ndLine<br><br>3rdLine<br><br>'
				}
			];

		testCases.forEach(function(testCase) {
			assert.equal(test(testCase.string), testCase.expected);
		});
	});
});
