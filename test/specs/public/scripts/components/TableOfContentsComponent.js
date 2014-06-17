moduleForComponent('table-of-contents', 'TableOfContentsComponent');

test('Beginning state', function () {
	expect(1);
	var component = this.subject();
	equal(component.isCollapsed, true, 'component should start collapsed');
});

test('Calling toggleMenu to expand and then collapse', function () {
	expect(2);
	var component = this.subject();
	component.send('toggleMenu');
	equal(component.isCollapsed, false, 'component should then be expanded');
	component.send('toggleMenu');
	equal(component.isCollapsed, true, 'it should flip back to collapsed');
});
