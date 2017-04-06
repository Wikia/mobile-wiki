import {moduleForComponent, test} from 'ember-qunit';

moduleForComponent('site-head', 'Unit | Component | site head', {
	// Specify the other units that are required for this test
	// needs: ['component:foo', 'helper:bar'],
	unit: true
});

test('correct icons returned', function (assert) {
	const component = this.subject(),
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
