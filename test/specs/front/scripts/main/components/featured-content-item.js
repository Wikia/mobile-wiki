moduleForComponent('featured-content-item', 'FeaturedContentItemComponent', {
	unit: true
});

test('computes container height properly', function () {
	var componentMock = this.subject(),
		viewportWidth = 400,
		// 16:9 ratio
		containerHeight = 225;

	componentMock.updateContainerHeight(viewportWidth);

	equal(componentMock.get('style'), 'height: ' + containerHeight + 'px;');
});
