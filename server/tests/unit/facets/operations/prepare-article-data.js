QUnit.module('facets/operations/prepare-article-data');

QUnit.test('getStandardTitle', function (assert) {
	var testCases = [
		{
			request: {
				params: {
					title: 'Rachel_Berry'
				}
			},
			articleData: {
				article: {
					displayTitle: 'Brittany Pierce'
				},
				details: {
					title: 'Burt Hummel'
				}
			},
			expected: 'Brittany Pierce',
			description: 'When possible title is taken from displayTitle'
		},
		{
			request: {
				params: {
					title: 'Rachel_Berry'
				}
			},
			articleData: {
				details: {
					title: 'Burt Hummel'
				}
			},
			expected: 'Burt Hummel',
			description: 'When displayTitle not available title is taken from details'
		},
		{
			request: {
				params: {
					title: 'Rachel_Berry'
				}
			},
			articleData: {},
			expected: 'Rachel Berry',
			description: 'When displayTitle and title from details not available title is taken from request'
		}
	];

	testCases.forEach(function (testCase) {
		assert.equal(
			global.getTitle(testCase.request, testCase.articleData),
			testCase.expected,
			testCase.description
		);
	});
});
