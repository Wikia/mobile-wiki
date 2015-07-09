moduleForComponent('trending-videos-item', 'TrendingVideosItemComponent');

test('computes thumb url properly', function () {
	var componentMock = this.subject();

	componentMock.thumbnailer.getThumbURL = function (url, options) {
		return url + '/' + options.mode + '/' + options.width + '/' + options.height;
	};

	componentMock.setProperties({
		imageWidth: 250,
		mode: 'top-crop',
		video: {
			url: 'http://vignette/image.jpg'
		}
	});

	equal(componentMock.get('thumbUrl'), 'http://vignette/image.jpg/top-crop/250/140');
});

test('computes image style properly', function () {
	var componentMock = this.subject();

	componentMock.updateImageSize(400);

	equal(componentMock.get('imageStyle'), 'height: 219px;');
});
