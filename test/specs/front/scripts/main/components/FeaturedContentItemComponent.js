moduleForComponent('featured-content-item', 'FeaturedContentItemComponent');

test('computes container height properly', function () {
	var componentMock = this.subject();

	componentMock.updateContainerHeight(400);

	equal(componentMock.get('style'), 'height: 225px;');
});
