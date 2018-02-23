import {run} from '@ember/runloop';
import {module, test} from 'qunit';
import {setupTest} from 'ember-qunit';

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

	run(() => {
		const component = testThis.owner.factoryFor('component:article-wrapper').create({
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

module('Unit | Component | article wrapper', (hooks) => {
	setupTest(hooks);

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
});
