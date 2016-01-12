moduleForComponent('curated-content-item', 'CuratedContentItemComponent', {
	unit: true
});

test('returns correct icon name', function () {
	var componentMock = this.subject();

	componentMock.set('type', 'category');
	equal(componentMock.get('icon'), 'namespace-category');

	componentMock.set('type', 'section');
	equal(componentMock.get('icon'), 'namespace-category');

	componentMock.set('type', 'video');
	equal(componentMock.get('icon'), 'namespace-video');

	componentMock.set('type', 'image');
	equal(componentMock.get('icon'), 'namespace-image');

	componentMock.set('type', 'blog');
	equal(componentMock.get('icon'), 'namespace-blog');

	componentMock.set('type', 'article');
	equal(componentMock.get('icon'), 'namespace-article');

	componentMock.set('type', 'whatever');
	equal(componentMock.get('icon'), 'namespace-article');
});

test('computes image style properly', function () {
	var componentMock = this.subject(),
		viewportWidth = 400,
		// Viewport minus 20 and then by half
		imageSize = 190;

	componentMock.updateImageSize(viewportWidth);

	equal(componentMock.get('style'), 'height: ' + imageSize + 'px; width: ' + imageSize + 'px;');
});
