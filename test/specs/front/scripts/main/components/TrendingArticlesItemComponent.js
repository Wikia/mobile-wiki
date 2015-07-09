moduleForComponent('trending-articles-item', 'TrendingArticlesItemComponent');

test('sets proper url for the image', function () {
	var componentMock = this.subject();

	componentMock.setProperties({
		imageWidth: 250,
		cropMode: 'top-crop',
		imageUrl: 'http://vignette/image.jpg'
	});

	componentMock.thumbnailer.getThumbURL = function (url, options) {
		return url + '/' + options.mode + '/' + options.width + '/' + options.height;
	};

	componentMock.lazyLoadImage();

	equal(componentMock.get('currentlyRenderedImageUrl'), 'http://vignette/image.jpg/top-crop/250/140');
});

test('computes style properly', function () {
	var componentMock = this.subject();

	componentMock.updateImageSize(400);

	equal(componentMock.get('style'), 'width: 190px;');
	equal(componentMock.get('imageStyle'), 'height: 106px;');
});
