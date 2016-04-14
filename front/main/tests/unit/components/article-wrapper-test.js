import Ember from 'ember';
import {test, moduleForComponent} from 'ember-qunit';

/**
 * @param {object} testThis
 * @param {object} testCase
 * @param {string} property
 * @param {object} assert comes from test
 * @returns {void}
 */
function contributionTestHelper(testThis, testCase, property, assert) {
	const section = 3,
		sectionId = 'myId',
		title = 'hello world';

	Ember.run(() => {
		const component = testThis.subject({
			section,
			sectionId,
			title,
			uploadFeatureEnabled: testCase.uploadFeatureEnabled,
			isJapaneseWikia: testCase.isJapaneseWikia,
			model: {
				isMainPage: testCase.isMainPage
			},
			currentUser: {
				isAuthenticated: testCase.hasOwnProperty('isAuthenticated') ?
					testCase.isAuthenticated : 'false'
			}
		});

		window.Mercury.wiki = {
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

		assert.equal(component.get(property), testCase.expected);
	});
}

const originalMercury = Ember.$.extend(true, {}, window.Mercury);

moduleForComponent('article-wrapper', 'Unit | Component | article wrapper', {
	unit: true,
	afterEach() {
		window.Mercury = Ember.$.extend(true, {}, originalMercury);
	}
});

test('shouldHandleMedia returns correct value', function (assert) {
	const testCases = [
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

	testCases.forEach((testCase) => {
		const component = this.subject();

		assert.equal(component.shouldHandleMedia(testCase.target, testCase.tagName), testCase.expected, assert);
	});
});

test('contribution disabled on main page', function (assert) {
	contributionTestHelper(this, {
		isMainPage: true,
		isJapaneseWikia: true,
		disableMobileSectionEditor: false,
		expected: false
	}, 'contributionEnabled', assert);
});

test('contribution enabled on Japanese page', function (assert) {
	contributionTestHelper(this, {
		isMainPage: false,
		isJapaneseWikia: true,
		disableMobileSectionEditor: false,
		expected: true
	}, 'contributionEnabled', assert);
});

test('contribution disabled when disableMobileSectionEditor is set', function (assert) {
	contributionTestHelper(this, {
		isMainPage: false,
		isJapaneseWikia: true,
		disableMobileSectionEditor: true,
		expected: false
	}, 'contributionEnabled', assert);
});

test('contribution enabled on non-Japanese page 1', function (assert) {
	contributionTestHelper(this, {
		isMainPage: false,
		isJapaneseWikia: false,
		disableMobileSectionEditor: false,
		dbName: 'zhclashofclans723',
		expected: true
	}, 'contributionEnabled', assert);
});

test('contribution enabled on non-Japanese page 2', function (assert) {
	contributionTestHelper(this, {
		isMainPage: false,
		isJapaneseWikia: false,
		disableMobileSectionEditor: false,
		dbName: 'starwars',
		expected: true
	}, 'contributionEnabled', assert);
});

test('add photo icon visible on japanese page', function (assert) {
	contributionTestHelper(this, {
		isMainPage: false,
		isJapaneseWikia: true,
		disableMobileSectionEditor: false,
		expected: true
	}, 'addPhotoIconVisible', assert);
});

test('add photo icon not visible on japanese page', function (assert) {
	contributionTestHelper(this, {
		isMainPage: false,
		isJapaneseWikia: false,
		disableMobileSectionEditor: false,
		expected: false
	}, 'addPhotoIconVisible', assert);
});

test('edit icon visible on japanese page', function (assert) {
	contributionTestHelper(this, {
		isMainPage: false,
		isJapaneseWikia: true,
		disableMobileSectionEditor: false,
		expected: true
	}, 'editIconVisible', assert);
});

test('edit icon not visible on japanese page with section editor disabled', function (assert) {
	contributionTestHelper(this, {
		isMainPage: false,
		isJapaneseWikia: false,
		disableMobileSectionEditor: true,
		expected: false
	}, 'editIconVisible', assert);
});

test('logged in user can edit', function (assert) {
	contributionTestHelper(this, {
		isMainPage: false,
		isJapaneseWikia: true,
		disableMobileSectionEditor: false,
		isAuthenticated: true,
		expected: true
	}, 'editAllowed', assert);
});

test('coppa wiki requires log in', function (assert) {
	contributionTestHelper(this, {
		isMainPage: false,
		isJapaneseWikia: true,
		disableMobileSectionEditor: false,
		isAuthenticated: false,
		isCoppaWiki: true,
		disableAnonymousEditing: false,
		expected: false
	}, 'editAllowed', assert);
});

test('wiki with disableAnonymousEditing set requires log in', function (assert) {
	contributionTestHelper(this, {
		isMainPage: false,
		isJapaneseWikia: true,
		disableMobileSectionEditor: false,
		isAuthenticated: false,
		isCoppaWiki: false,
		disableAnonymousEditing: true,
		expected: false
	}, 'editAllowed', assert);
});

test('logged in user can upload photo', function (assert) {
	contributionTestHelper(this, {
		isMainPage: false,
		isJapaneseWikia: true,
		disableMobileSectionEditor: false,
		isAuthenticated: true,
		expected: true
	}, 'addPhotoAllowed', assert);
});

test('not logged in user can not upload photo', function (assert) {
	contributionTestHelper(this, {
		isMainPage: false,
		isJapaneseWikia: true,
		disableMobileSectionEditor: false,
		isAuthenticated: false,
		expected: false
	}, 'addPhotoAllowed', assert);
});
