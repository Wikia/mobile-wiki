define('mobile-wiki/tests/unit/components/article-wrapper-test', ['ember-qunit'], function (_emberQunit) {
	'use strict';

	/**
  * @param {object} testThis
  * @param {object} testCase
  * @param {string} property
  * @param {object} assert comes from test
  * @returns {void}
  */
	function contributionTestHelper(testThis, testCase, property, assert) {
		var section = 3,
		    sectionId = 'myId',
		    title = 'hello world';

		Ember.run(function () {
			var component = testThis.subject({
				section: section,
				sectionId: sectionId,
				title: title,
				model: {
					isMainPage: testCase.isMainPage
				},
				currentUser: {
					isAuthenticated: testCase.hasOwnProperty('isAuthenticated') ? testCase.isAuthenticated : 'false'
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
				disableAnonymousEditing: testCase.hasOwnProperty('disableAnonymousEditing') ? testCase.disableAnonymousEditing : false
			});

			assert.equal(component.get(property), testCase.expected);
		});
	}

	(0, _emberQunit.moduleForComponent)('article-wrapper', 'Unit | Component | article wrapper', {
		unit: true,
		needs: ['service:currentUser', 'service:fastboot', 'service:wiki-variables']
	});

	(0, _emberQunit.test)('contribution disabled on main page', function (assert) {
		contributionTestHelper(this, {
			isMainPage: true,
			disableMobileSectionEditor: false,
			expected: false
		}, 'contributionEnabled', assert);
	});

	(0, _emberQunit.test)('contribution enabled on Japanese page', function (assert) {
		contributionTestHelper(this, {
			isMainPage: false,
			disableMobileSectionEditor: false,
			expected: true
		}, 'contributionEnabled', assert);
	});

	(0, _emberQunit.test)('contribution disabled when disableMobileSectionEditor is set', function (assert) {
		contributionTestHelper(this, {
			isMainPage: false,
			disableMobileSectionEditor: true,
			expected: false
		}, 'contributionEnabled', assert);
	});

	(0, _emberQunit.test)('logged in user can edit', function (assert) {
		contributionTestHelper(this, {
			isMainPage: false,
			disableMobileSectionEditor: false,
			isAuthenticated: true,
			expected: true
		}, 'editAllowed', assert);
	});

	(0, _emberQunit.test)('coppa wiki requires log in', function (assert) {
		contributionTestHelper(this, {
			isMainPage: false,
			disableMobileSectionEditor: false,
			isAuthenticated: false,
			isCoppaWiki: true,
			disableAnonymousEditing: false,
			expected: false
		}, 'editAllowed', assert);
	});

	(0, _emberQunit.test)('wiki with disableAnonymousEditing set requires log in', function (assert) {
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