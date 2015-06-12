moduleFor('view:article', 'Article View', {
	needs: ['controller:article', 'controller:application'],
	setup: function () {
		this.view = this.subject();
	},
	teardown: function () {
	}
});

test('shouldHandleMedia returns correct value', function () {
	var articleViewMock = this.subject(),
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
		equal(articleViewMock.shouldHandleMedia(testCase.target, testCase.tagName), testCase.expected);
	});
});
