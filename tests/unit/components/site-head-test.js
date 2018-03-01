import {module, test} from 'qunit';
import {setupTest} from 'ember-qunit';

module('Unit | Component | site head', (hooks) => {
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
					navIcon: 'wds-icons-cross',
					searchIcon: 'wds-icons-magnifying-glass'
				},
				{
					drawerVisible: true,
					drawerContent: 'search',
					navIcon: 'wds-icons-menu',
					searchIcon: 'wds-icons-cross'
				},
				{
					drawerVisible: true,
					drawerContent: null,
					navIcon: 'wds-icons-menu',
					searchIcon: 'wds-icons-magnifying-glass'
				},
				{
					drawerVisible: false,
					drawerContent: 'nav',
					navIcon: 'wds-icons-menu',
					searchIcon: 'wds-icons-magnifying-glass'
				},
				{
					drawerVisible: false,
					drawerContent: 'search',
					navIcon: 'wds-icons-menu',
					searchIcon: 'wds-icons-magnifying-glass'
				},
				{
					drawerVisible: false,
					drawerContent: null,
					navIcon: 'wds-icons-menu',
					searchIcon: 'wds-icons-magnifying-glass'
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
