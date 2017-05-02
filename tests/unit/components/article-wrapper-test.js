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
			model: {
				isMainPage: testCase.isMainPage
			},
			currentUser: {
				isAuthenticated: testCase.hasOwnProperty('isAuthenticated') ?
					testCase.isAuthenticated : 'false'
			}
		});

		component.set('wikiVariables', {
			id: 80433,
			dbName: testCase.hasOwnProperty('dbName') ? testCase.dbName : 'wikiaglobal',
			language: {
				user: 'en'
			},
			disableMobileSectionEditor: testCase.disableMobileSectionEditor,
			isCoppaWiki: testCase.hasOwnProperty('isCoppaWiki') ? testCase.isCoppaWiki : false,
			disableAnonymousEditing: testCase.hasOwnProperty('disableAnonymousEditing') ?
				testCase.disableAnonymousEditing : false
		});

		assert.equal(component.get(property), testCase.expected);
	});
}

function featuredVideoTestHelper(testThis, testCase, property, assert) {
	const component = testThis.subject({
		model: {
			featuredVideo: testCase.featuredVideo,
			hasPortableInfobox: testCase.hasPortableInfobox
		}
	});

	assert.equal(component.get(property), testCase.expected);
}

moduleForComponent('article-wrapper', 'Unit | Component | article wrapper', {
	unit: true
});

test('contribution disabled on main page', function (assert) {
	contributionTestHelper(this, {
		isMainPage: true,
		disableMobileSectionEditor: false,
		expected: false
	}, 'contributionEnabled', assert);
});

test('contribution enabled on Japanese page', function (assert) {
	contributionTestHelper(this, {
		isMainPage: false,
		disableMobileSectionEditor: false,
		expected: true
	}, 'contributionEnabled', assert);
});

test('contribution disabled when disableMobileSectionEditor is set', function (assert) {
	contributionTestHelper(this, {
		isMainPage: false,
		disableMobileSectionEditor: true,
		expected: false
	}, 'contributionEnabled', assert);
});

test('logged in user can edit', function (assert) {
	contributionTestHelper(this, {
		isMainPage: false,
		disableMobileSectionEditor: false,
		isAuthenticated: true,
		expected: true
	}, 'editAllowed', assert);
});

test('coppa wiki requires log in', function (assert) {
	contributionTestHelper(this, {
		isMainPage: false,
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
		disableMobileSectionEditor: false,
		isAuthenticated: false,
		isCoppaWiki: false,
		disableAnonymousEditing: true,
		expected: false
	}, 'editAllowed', assert);
});

test('featured video visible for articles without infoboxes and featured video set', function (assert) {
	featuredVideoTestHelper(this, {
		featuredVideo: {},
		hasPortableInfobox: false,
		expected: true
	}, 'featuredVideoVisible', assert);
});

test('featured video is not visible for articles with infoboxes and featured video set', function (assert) {
	featuredVideoTestHelper(this, {
		featuredVideo: {},
		hasPortableInfobox: true,
		expected: false
	}, 'featuredVideoVisible', assert);
});

test('featured video is not visible for articles without featured video set', function (assert) {
	featuredVideoTestHelper(this, {
		featuredVideo: undefined,
		expected: false
	}, 'featuredVideoVisible', assert);
});
