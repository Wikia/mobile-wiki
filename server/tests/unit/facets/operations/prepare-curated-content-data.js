QUnit.module('facets/operations/prepare-curated-content-data');

QUnit.test('getStandardTitle', function (assert) {
	var testCases = [
		{
			request: {
				url: {
					path: '/main/section/category:C17আমিকাঁচ_খেতে_পারি,_তাতে_আমার_কোনো_ক্ষতি_হয়_না।'
				}
			},
			wikiVariables: {
				mainPageTitle: 'Muppet Wiki'
			},
			expected: 'category:C17আমিকাঁচ_খেতে_পারি,_তাতে_আমার_কোনো_ক্ষতি_হয়_না।',
			description: 'For sections title is taken from request\'s url path when possible'
		}, {
			request: {
				url: {
					path: '/main/section/category:%20C17আমিকাঁচ_খেতে_পারি,_তাতে_আমার_কোনো_ক্ষতি_হয়_না।'
				}
			},
			wikiVariables: {
				mainPageTitle: 'Muppet Wiki'
			},
			expected: 'category: C17আমিকাঁচ_খেতে_পারি,_তাতে_আমার_কোনো_ক্ষতি_হয়_না।',
			description: 'For sections %20 is replaced to space in request\'s url path'
		}, {
			request: {
				url: {
					path: '/main/category/C17আমিকাঁচ_খেতে_পারি,_তাতে_আমার_কোনো_ক্ষতি_হয়_না।'
				}
			},
			wikiVariables: {
				mainPageTitle: 'Muppet Wiki'
			},
			expected: 'C17আমিকাঁচ_খেতে_পারি,_তাতে_আমার_কোনো_ক্ষতি_হয়_না।',
			description: 'For categories title is taken from request\'s url path when possible'
		}, {
			request: {
				url: {
					path: '/main/category/%20C17আমিকাঁচ_খেতে_পারি,_তাতে_আমার_কোনো_ক্ষতি_হয়_না।'
				}
			},
			wikiVariables: {
				mainPageTitle: 'Muppet Wiki'
			},
			expected: ' C17আমিকাঁচ_খেতে_পারি,_তাতে_আমার_কোনো_ক্ষতি_হয়_না।',
			description: 'For categories %20 is replaced to space in request\'s url path'
		}, {
			request: {
				url: {
					path: 'আমিকাঁচ_খেতে_পারি,_তাতে_আমার_কোনো_ক্ষতি_হয়_না।'
				}
			},
			wikiVariables: {
				mainPageTitle: 'Muppet_Wiki'
			},
			expected: 'Muppet Wiki',
			description: 'Title is taken from wiki variables when "category" or "section" not in URL'
		}
	];

	testCases.forEach(function (testCase) {
		assert.equal(
			global.getTitle(testCase.request, testCase.wikiVariables),
			testCase.expected,
			testCase.description
		);
	});
});
