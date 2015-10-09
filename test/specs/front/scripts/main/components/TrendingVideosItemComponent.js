moduleForComponent('trending-videos-item', 'TrendingVideosItemComponent', {
	unit: true
});

test('computes thumb url properly', function () {
	var componentMock = this.subject(),
		imageWidth = 250,
		// 16:9 ratio
		imageHeight = 140;

	componentMock.thumbnailer.getThumbURL = function (url, options) {
		return url + '/' + options.mode + '/' + options.width + '/' + options.height;
	};

	componentMock.setProperties({
		imageWidth: imageWidth,
		mode: 'top-crop',
		video: {
			url: 'http://vignette/image.jpg'
		}
	});

	equal(componentMock.get('thumbUrl'), 'http://vignette/image.jpg/top-crop/' + imageWidth + '/' + imageHeight);
});

test('computes image style properly', function () {
	var componentMock = this.subject(),
		viewportWidth = 400,
		// Viewport width minus 10 and then calculate 16:9 ratio
		imageHeight = 219;

	componentMock.updateImageSize(viewportWidth);

	equal(componentMock.get('imageStyle'), 'height: ' + imageHeight + 'px;');
});
