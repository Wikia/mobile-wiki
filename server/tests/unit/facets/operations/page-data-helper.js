QUnit.module('facets/operations/page-data-helper');

QUnit.test('isRtl', function (assert) {
	var testCases = [
		{
			wikiVariables: {
				language: {
					contentDir: 'ltr'
				}
			},
			expected: false,
			description: 'Returns false when contentDir is ltr'
		}, {
			wikiVariables: {
				language: {
					contentDir: 'rtl'
				}
			},
			expected: true,
			description: 'Returns true when contentDir is ltr'
		}, {
			wikiVariables: {},
			expected: false,
			description: 'Returns false when language not set in wiki variables'
		}
	];

	testCases.forEach(function (testCase) {
		assert.equal(
			global.isRtl(testCase.wikiVariables),
			testCase.expected,
			testCase.description
		);
	});
});

QUnit.test('getUserId', function (assert) {
	var testCases = [
		{
			request: {
				auth: {
					isAuthenticated: true,
					credentials: {
						userId: 7
					}
				}
			},
			expected: 7,
			description: 'Returns userId from credentials when user is authenticated'
		}, {
			request: {
				auth: {
					isAuthenticated: false,
					credentials: {
						userId: 7
					}
				}
			},
			expected: 0,
			description: 'Returns 0 when user is not authenticated'
		}
	];

	testCases.forEach(function (testCase) {
		assert.equal(
			global.getUserId(testCase.request),
			testCase.expected,
			testCase.description
		);
	});
});


QUnit.test('getQualarooScriptUrl', function (assert) {
	var testCases = [
		{
			request: {
				query: {
					noexternals: true
				}
			},
			localSettings: {
				qualaroo: {}
			},
			expected: false,
			description: 'Returns false when noexternals in query params'
		}, {
			request: {
				query: {
					noexternals: false
				}
			},
			localSettings: {
				qualaroo: {
					enabled: false
				}
			},
			expected: false,
			description: 'Returns false when qualaroo disabled in local settings'
		}, {
			request: {
				query: {
					noexternals: false
				}
			},
			localSettings: {
				qualaroo: {
					enabled: true,
					scriptUrl: 'http://url-to-quaraloo.com'
				},
			},
			expected: 'http://url-to-quaraloo.com',
			description: 'Returns quaraloo script url when qualaroo enabled in local settings'
		}
	];

	testCases.forEach(function (testCase) {
		var localSettingsDefault = global.localSettings.default;

		global.localSettings.default.qualaroo = testCase.localSettings.qualaroo;

		assert.equal(
			global.getQualarooScriptUrl(testCase.request),
			testCase.expected,
			testCase.description
		);

		global.localSettings.default = localSettingsDefault;
	});
});

QUnit.test('getOpenGraphData', function (assert) {
	var testCases = [
		{
			type: 'article',
			title: 'Rachel Berry',
			url: 'http://glee.wikia.com/wiki/Rachel',
			expected: {
				type: 'article',
				title: 'Rachel Berry',
				url: 'http://glee.wikia.com/wiki/Rachel'
			}
		}, {
			type: 'article',
			title: 'Rachel Berry',
			url: 'http://glee.wikia.com/wiki/Rachel',
			pageData: {
				details: {
					abstract: 'Lorem Ipsum',
					thumbnail: 'rachel.jpg'
				}
			},
			expected: {
				type: 'article',
				title: 'Rachel Berry',
				url: 'http://glee.wikia.com/wiki/Rachel',
				image: 'rachel.jpg',
				description: 'Lorem Ipsum'
			}
		}, {
			type: 'article',
			title: 'Rachel Berry',
			url: 'http://glee.wikia.com/wiki/Rachel',
			pageData: {},
			expected: {
				type: 'article',
				title: 'Rachel Berry',
				url: 'http://glee.wikia.com/wiki/Rachel'
			}
		}, {
			type: 'article',
			title: 'Rachel Berry',
			url: 'http://glee.wikia.com/wiki/Rachel',
			pageData: {
				details: {}
			},
			expected: {
				type: 'article',
				title: 'Rachel Berry',
				url: 'http://glee.wikia.com/wiki/Rachel'
			}
		}, {
			type: 'article',
			title: 'Rachel Berry',
			url: 'http://glee.wikia.com/wiki/Rachel',
			pageData: {
				details: {
					abstract: 'Lorem Ipsum'
				}
			},
			expected: {
				type: 'article',
				title: 'Rachel Berry',
				url: 'http://glee.wikia.com/wiki/Rachel',
				description: 'Lorem Ipsum'
			}
		}, {
			type: 'article',
			title: 'Rachel Berry',
			url: 'http://glee.wikia.com/wiki/Rachel',
			pageData: {
				details: {
					thumbnail: 'rachel.jpg'
				}
			},
			expected: {
				type: 'article',
				title: 'Rachel Berry',
				url: 'http://glee.wikia.com/wiki/Rachel',
				image: 'rachel.jpg'
			}
		}
	];

	testCases.forEach(function (testCase) {
		var result = global.getOpenGraphData(testCase.type, testCase.title, testCase.url, testCase.pageData);

		assert.equal(result.type, testCase.expected.type, 'Type is set as expected');
		assert.equal(result.title, testCase.expected.title, 'Title is set as expected');
		assert.equal(result.url, testCase.expected.url, 'URL is set as expected');
		assert.equal(result.image, testCase.expected.image, 'Image is set as expected');
		assert.equal(result.description, testCase.expected.description, 'Description is set as expected');
	});
});

QUnit.test('getDefaultTitle', function (assert) {
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
			global.getDefaultTitle(testCase.request, testCase.articleData),
			testCase.expected,
			testCase.description
		);
	});
});

QUnit.test('getCuratedMainPageTitle', function (assert) {
	var testCases = [
		{
			url: 'http://muppet.wikia.com/main/section/category:C17আমিকাঁচ_খেতে_পারি,_তাতে_আমার_কোনো_ক্ষতি_হয়_না।',
			expected: 'category:C17আমিকাঁচ খেতে পারি, তাতে আমার কোনো ক্ষতি হয় না।',
			description: 'For sections title is taken from request\'s url path when possible'
		},
		{
			url: 'http://muppet.wikia.com/main/section/category:%20C17আমিকাঁচ_খেতে_পারি,_তাতে_আমার_কোনো_ক্ষতি_হয়_না।',
			expected: 'category: C17আমিকাঁচ খেতে পারি, তাতে আমার কোনো ক্ষতি হয় না।',
			description: 'For sections %20 is replaced to space in request\'s url path'
		},
		{
			url: 'http://muppet.wikia.com/main/category/C17আমিকাঁচ_খেতে_পারি,_তাতে_আমার_কোনো_ক্ষতি_হয়_না।',
			expected: 'C17আমিকাঁচ খেতে পারি, তাতে আমার কোনো ক্ষতি হয় না।',
			description: 'For categories title is taken from request\'s url path when possible'
		},
		{
			url: 'http://muppet.wikia.com/main/category/%20C17আমিকাঁচ_খেতে_পারি,_তাতে_আমার_কোনো_ক্ষতি_হয়_না।',
			expected: ' C17আমিকাঁচ খেতে পারি, তাতে আমার কোনো ক্ষতি হয় না।',
			description: 'For categories %20 is replaced to space in request\'s url path'
		},
		{
			url: 'http://muppet.wikia.com/আমিকাঁচ_খেতে_পারি,_তাতে_আমার_কোনো_ক্ষতি_হয়_না।',
			expected: 'Muppet Wiki',
			description: 'Title is taken from wiki variables when "category" or "section" not in URL'
		},
		{
			url: 'http://muppet.wikia.com/main/section/Kermit?isMuppet=true',
			expected: 'Kermit',
			description: 'Section title is not affected by query params'
		},
		{
			url: 'http://muppet.wikia.com/main/category/Kermit?isMuppet=true',
			expected: 'Kermit',
			description: 'Category title is not affected by query params'
		}
	];

	testCases.forEach(function (testCase) {
		var urlObject = require('url').parse(testCase.url);

		assert.equal(
			global.getCuratedMainPageTitle({url: urlObject}, {mainPageTitle: 'Muppet Wiki'}),
			testCase.expected,
			testCase.description
		);
	});
});
