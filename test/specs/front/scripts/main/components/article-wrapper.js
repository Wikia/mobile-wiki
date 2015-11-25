moduleForComponent('article-wrapper', 'ArticleWrapperComponent', {
	unit: true
});

test('shouldHandleMedia returns correct value', function () {
	var component = this.subject(),
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
		equal(component.shouldHandleMedia(testCase.target, testCase.tagName), testCase.expected);
	});
});
