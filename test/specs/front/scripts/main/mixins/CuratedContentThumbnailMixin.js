var mixinMock;

moduleFor('mixin:curatedContentThumbnail', 'CuratedContentThumbnailMixin', {
	setup: function () {
		mixinMock = Em.Object.createWithMixins(App.CuratedContentThumbnailMixin, {});
	}
});

test('sets aspectRatio property correctly', function () {
	mixinMock.set('block', 'featured');
	equal(mixinMock.get('aspectRatio'), 16 / 9);

	mixinMock.set('block', 'curated');
	equal(mixinMock.get('aspectRatio'), 1);

	mixinMock.set('block', 'optional');
	equal(mixinMock.get('aspectRatio'), 1);
});

test('sets aspectRatioName property correctly', function () {
	mixinMock.set('block', 'featured');
	equal(mixinMock.get('aspectRatioName'), 'landscape');

	mixinMock.set('block', 'curated');
	equal(mixinMock.get('aspectRatioName'), 'square');

	mixinMock.set('block', 'optional');
	equal(mixinMock.get('aspectRatioName'), 'square');
});

test('sets imageHeight property correctly', function () {
	mixinMock.setProperties({
		aspectRatio: 16 / 9,
		imageWidth: 400
	});
	equal(mixinMock.get('imageHeight'), 400 / (16 / 9));

	mixinMock.setProperties({
		aspectRatio: 1,
		imageWidth: 200
	});
	equal(mixinMock.get('imageHeight'), 200);
});

test('generates thumbnail URL correctly with image crop data', function () {
	var imageUrl = 'http://vignette/image.jpg',
		imageWidth = 400,
		imageCrop = {
			x: 100,
			y: 100,
			width: 1600,
			height: 900
		};

	mixinMock.setProperties({
		thumbnailer: {
			mode: {
				windowCrop: 'window-crop'
			}
		},
		cropMode: 'top-crop',
		imageWidth: imageWidth
	});

	mixinMock.thumbnailer.getThumbURL = function (url, options) {
		return url + '/' +
			options.mode + '/' +
			options.width + '/' +
			options.xOffset1 + '/' +
			options.yOffset1 + '/' +
			options.xOffset2 + '/' +
			options.yOffset2;
	};

	equal(
		mixinMock.generateThumbUrl(imageUrl, imageCrop),
		'http://vignette/image.jpg/window-crop/' +
		imageWidth + '/' +
		imageCrop.x + '/' +
		imageCrop.y + '/' +
		// JavaScript has one shared operator for addition and concatenation.
		// Parentheses below ensure the interpreter first calculates the sum then concatenates the string.
		(imageCrop.x + imageCrop.width) + '/' +
		(imageCrop.y + imageCrop.height)
	);
});

test('generates thumbnail URL correctly without image crop data', function () {
	var imageUrl = 'http://vignette/image.jpg',
		imageWidth = 400,
		imageHeight = 225;

	mixinMock.setProperties({
		cropMode: 'top-crop',
		imageHeight: imageHeight,
		imageWidth: imageWidth
	});

	mixinMock.thumbnailer.getThumbURL = function (url, options) {
		return url + '/' + options.mode + '/' + options.width + '/' + options.height;
	};

	equal(
		mixinMock.generateThumbUrl(imageUrl),
		'http://vignette/image.jpg/top-crop/' + imageWidth + '/' + imageHeight
	);
});
