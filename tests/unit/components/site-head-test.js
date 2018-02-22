import {module, test} from 'qunit';
import {setupTest} from 'ember-qunit';

module('Unit | Component | site head', function (hooks) {
	setupTest(hooks);

	hooks.beforeEach(function () {
		this.owner.register('service:currentUser', window.document, {instantiate: false});
	});

	test('correct icons returned', function (assert) {
		const component = this.owner.factoryFor('component:site-head').create(),
			cases = [
				{
					drawerVisible: true,
					drawerContent: 'nav',
					navIcon: 'close',
					searchIcon: 'search'
				},
				{
					drawerVisible: true,
					drawerContent: 'search',
					navIcon: 'nav',
					searchIcon: 'close'
				},
				{
					drawerVisible: true,
					drawerContent: null,
					navIcon: 'nav',
					searchIcon: 'search'
				},
				{
					drawerVisible: false,
					drawerContent: 'nav',
					navIcon: 'nav',
					searchIcon: 'search'
				},
				{
					drawerVisible: false,
					drawerContent: 'search',
					navIcon: 'nav',
					searchIcon: 'search'
				},
				{
					drawerVisible: false,
					drawerContent: null,
					navIcon: 'nav',
					searchIcon: 'search'
				}
			];

		cases.forEach((testCase) => {
			component.set('drawerVisible', testCase.drawerVisible);
			component.set('drawerContent', testCase.drawerContent);

			assert.equal(component.get('navIcon'), testCase.navIcon);
			assert.equal(component.get('searchIcon'), testCase.searchIcon);

		});
	});
});
