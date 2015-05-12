moduleFor('view:application', 'Application View');

test('shouldHandleMedia returns correct value', function () {
	var appViewMock = this.subject(),
		testCases = [
			{
				tagName: 'img',
				target: {},
				expected: true
			},
			{
				tagName: 'figure',
				target: {},
				expected: true
			},
			{
				tagName: 'picture',
				target: {},
				expected: false
			},
			{
				tagName: 'picture',
				target: '<picture><a></a></picture>',
				expected: false
			},
			{
				tagName: 'figure',
				target: '<figure><a href="http://www.wikia.com">Wikia</a></figure>',
				expected: false
			},
			{
				tagName: 'figure',
				target: '<figure><figcaption><a href="http://www.wikia.com">Wikia</a></figcaption></figure>',
				expected: true
			}
		];

	testCases.forEach(function(testCase) {
		equal(appViewMock.shouldHandleMedia(testCase.target, testCase.tagName), testCase.expected);
	});
});

test('isMWContent returns correct value', function () {
	var appViewMock = this.subject(),
		testCases = [
			{
				target: '<li class="mw-content"></li>',
				expected: true
			},
			{
				target: '<li></li>',
				expected: false
			}
		];

	testCases.forEach(function(testCase) {
		equal(appViewMock.isMWContent(testCase.target), testCase.expected);
	});
});
