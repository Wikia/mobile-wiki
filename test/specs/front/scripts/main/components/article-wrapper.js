moduleForComponent('article-wrapper', 'ArticleWrapperComponent', {
	unit: true,
	beforeEach: function () {
		this.originalWiki = Mercury.wiki;
	},
	afterEach: function () {
		Mercury.wiki = this.originalWiki;
	}
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

	testCases.forEach(function (testCase) {
		equal(component.shouldHandleMedia(testCase.target, testCase.tagName), testCase.expected);
	});
});

function contributionTestHelper(self, testCase, property) {
	var section = 3,
		sectionId = 'myId',
		title = 'hello world',
		component = null;

	Ember.run(function () {
		component = self.subject({
			attrs: {
				section: section,
				sectionId: sectionId,
				title: title,
				uploadFeatureEnabled: testCase.uploadFeatureEnabled,
				isJapaneseWikia: testCase.isJapaneseWikia,
				model: {
					isMainPage: testCase.isMainPage
				},
				currentUser: {
					isAuthenticated: testCase.hasOwnProperty('isAuthenticated') ?
						testCase.isAuthenticated : 'false',
				}
			}
		});

		Mercury.wiki = {
			id: 80433,
			dbName: testCase.hasOwnProperty('dbName') ? testCase.dbName : 'wikiaglobal',
			language: {
				user: 'en'
			},
			disableMobileSectionEditor: testCase.disableMobileSectionEditor,
			isCoppaWiki: testCase.hasOwnProperty('isCoppaWiki') ? testCase.isCoppaWiki : false,
			disableAnonymousEditing: testCase.hasOwnProperty('disableAnonymousEditing') ?
				testCase.disableAnonymousEditing : false
		};

		equal(component.get(property), testCase.expected);
	});
}

test('contribution disabled on main page', function () {
	contributionTestHelper(this, {
		isMainPage: true,
		isJapaneseWikia: true,
		disableMobileSectionEditor: false,
		expected: false,
	}, 'contributionEnabled');
});

test('contribution enabled on Japanese page', function () {
	contributionTestHelper(this, {
		isMainPage: false,
		isJapaneseWikia: true,
		disableMobileSectionEditor: false,
		expected: true
	}, 'contributionEnabled');
});

test('contribution disabled when disableMobileSectionEditor is set', function () {
	contributionTestHelper(this, {
		isMainPage: false,
		isJapaneseWikia: true,
		disableMobileSectionEditor: true,
		expected: false
	}, 'contributionEnabled');
});

test('contribution enabled on non-Japanese page 1', function () {
	contributionTestHelper(this, {
		isMainPage: false,
		isJapaneseWikia: false,
		disableMobileSectionEditor: false,
		dbName: 'zhclashofclans723',
		expected: true
	}, 'contributionEnabled');
});

test('contribution enabled on non-Japanese page 2', function () {
	contributionTestHelper(this, {
		isMainPage: false,
		isJapaneseWikia: false,
		disableMobileSectionEditor: false,
		dbName: 'starwars',
		expected: true
	}, 'contributionEnabled');
});

test('add photo icon visible on japanese page', function () {
	contributionTestHelper(this, {
		isMainPage: false,
		isJapaneseWikia: true,
		disableMobileSectionEditor: false,
		expected: true
	}, 'addPhotoIconVisible');
});

test('add photo icon not visible on japanese page', function () {
	contributionTestHelper(this, {
		isMainPage: false,
		isJapaneseWikia: false,
		disableMobileSectionEditor: false,
		expected: false
	}, 'addPhotoIconVisible');
});

test('edit icon visible on japanese page', function () {
	contributionTestHelper(this, {
		isMainPage: false,
		isJapaneseWikia: true,
		disableMobileSectionEditor: false,
		expected: true
	}, 'editIconVisible');
});

test('edit icon not visible on japanese page with section editor disabled', function () {
	contributionTestHelper(this, {
		isMainPage: false,
		isJapaneseWikia: false,
		disableMobileSectionEditor: true,
		expected: false
	}, 'editIconVisible');
});

test('logged in user can edit', function () {
	contributionTestHelper(this, {
		isMainPage: false,
		isJapaneseWikia: true,
		disableMobileSectionEditor: false,
		isAuthenticated: true,
		expected: true
	}, 'editAllowed');
});

test('coppa wiki requires log in', function () {
	contributionTestHelper(this, {
		isMainPage: false,
		isJapaneseWikia: true,
		disableMobileSectionEditor: false,
		isAuthenticated: false,
		isCoppaWiki: true,
		disableAnonymousEditing: false,
		expected: false
	}, 'editAllowed');
});

test('wiki with disableAnonymousEditing set requires log in', function () {
	contributionTestHelper(this, {
		isMainPage: false,
		isJapaneseWikia: true,
		disableMobileSectionEditor: false,
		isAuthenticated: false,
		isCoppaWiki: false,
		disableAnonymousEditing: true,
		expected: false
	}, 'editAllowed');
});

test('logged in user can upload photo', function () {
	contributionTestHelper(this, {
		isMainPage: false,
		isJapaneseWikia: true,
		disableMobileSectionEditor: false,
		isAuthenticated: true,
		expected: true
	}, 'addPhotoAllowed');
});

test('not logged in user can not upload photo', function () {
	contributionTestHelper(this, {
		isMainPage: false,
		isJapaneseWikia: true,
		disableMobileSectionEditor: false,
		isAuthenticated: false,
		expected: false
	}, 'addPhotoAllowed');
});
