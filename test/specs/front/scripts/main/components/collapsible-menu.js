moduleForComponent('collapsible-menu', 'CollapsibleMenuComponent', {
	unit: true
});

test('Beginning state', function () {
	var component = this.subject();
	equal(component.isCollapsed, true, 'component should start collapsed');
});

test('Calling toggleMenu to expand and then collapse', function () {
	expect(2);
	var component = this.subject();
	Ember.run(function () {
		component.send('toggleMenu');
		equal(component.isCollapsed, false, 'component should then be expanded');
		component.send('toggleMenu');
		equal(component.isCollapsed, true, 'it should flip back to collapsed');
	});
});
