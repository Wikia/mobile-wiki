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
	var componentMock = this.subject(),
		imageWidth = 400;

	componentMock.setProperties({
		imageWidth: imageWidth,
		cropMode: 'top-crop',
		model: {
			imageUrl: 'http://vignette/image.jpg'
		}
	});

	componentMock.thumbnailer.getThumbURL = function (url, options) {
		return url + '/' + options.mode + '/' + options.width + '/' + options.height;
	};

	componentMock.lazyLoadImage();

	equal(componentMock.get('thumbUrl'), 'http://vignette/image.jpg/top-crop/' + imageWidth + '/' + imageWidth);
});

test('computes image style properly', function () {
	var componentMock = this.subject(),
		viewportWidth = 400,
		// Viewport minus 20 and then by half
		imageSize = 190;

	componentMock.updateImageSize(viewportWidth);

	equal(componentMock.get('style'), 'height: ' + imageSize + 'px; width: ' + imageSize + 'px;');
});
