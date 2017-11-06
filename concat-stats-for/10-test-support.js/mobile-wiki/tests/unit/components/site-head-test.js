define('mobile-wiki/tests/unit/components/site-head-test', ['ember-qunit'], function (_emberQunit) {
	'use strict';

	(0, _emberQunit.moduleForComponent)('site-head', 'Unit | Component | site head', {
		unit: true,
		needs: ['service:ads', 'service:notifications'],
		beforeEach: function beforeEach() {
			this.register('service:currentUser', window.document, { instantiate: false });
		}
	});

	(0, _emberQunit.test)('correct icons returned', function (assert) {
		var component = this.subject(),
		    cases = [{
			drawerVisible: true,
			drawerContent: 'nav',
			navIcon: 'close',
			searchIcon: 'search'
		}, {
			drawerVisible: true,
			drawerContent: 'search',
			navIcon: 'nav',
			searchIcon: 'close'
		}, {
			drawerVisible: true,
			drawerContent: null,
			navIcon: 'nav',
			searchIcon: 'search'
		}, {
			drawerVisible: false,
			drawerContent: 'nav',
			navIcon: 'nav',
			searchIcon: 'search'
		}, {
			drawerVisible: false,
			drawerContent: 'search',
			navIcon: 'nav',
			searchIcon: 'search'
		}, {
			drawerVisible: false,
			drawerContent: null,
			navIcon: 'nav',
			searchIcon: 'search'
		}];

		cases.forEach(function (testCase) {
			component.set('drawerVisible', testCase.drawerVisible);
			component.set('drawerContent', testCase.drawerContent);

			assert.equal(component.get('navIcon'), testCase.navIcon);
			assert.equal(component.get('searchIcon'), testCase.searchIcon);
		});
	});
});