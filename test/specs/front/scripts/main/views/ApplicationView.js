moduleFor('view:application', 'Application View');

test('shouldHandleClick returns correct value', function () {
	var appViewMock = this.subject(),
		testCases = [
			{
				target: '<li class="mw-content"></li>',
				expected: true
			},
			{
				target: '<li></li>',
				expected: false
			},
			{
				target: '<div class="PDS_Poll"></div>',
				expected: false
			}
		];

	testCases.forEach(function(testCase) {
		equal(appViewMock.shouldHandleClick(testCase.target), testCase.expected);
	});
});
