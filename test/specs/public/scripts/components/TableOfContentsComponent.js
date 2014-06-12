moduleForComponent('table-of-contents', 'TableOfContentsComponent');

test('Beginning state', function () {
	expect(1);
	var component = this.subject();
	equal(component.isCollapsed, true, 'component should start collapsed');
});
