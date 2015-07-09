moduleForComponent('curated-content-item', 'CuratedContentItemComponent');

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

test('sets proper url for the image', function () {
	var componentMock = this.subject();

	componentMock.setProperties({
		imageSize: 400,
		cropMode: 'top-crop',
		model: {
			imageUrl: 'http://vignette/image.jpg'
		}
	});

	componentMock.thumbnailer.getThumbURL = function (url, options) {
		return url + '/' + options.mode + '/' + options.width + '/' + options.height;
	};

	componentMock.lazyLoadImage();

	equal(componentMock.get('thumbUrl'), 'http://vignette/image.jpg/top-crop/400/400');
});

test('computes image style properly', function () {
	var componentMock = this.subject();

	componentMock.updateImageSize(400);

	equal(componentMock.get('style'), 'height: 190px; width: 190px;');
});
