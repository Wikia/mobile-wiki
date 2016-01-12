var originalThumbnailerGetThumbURL = mrequire('mercury/modules/Thumbnailer').default.getThumbURL;

moduleFor('mixin:curated-content-thumbnail', 'CuratedContentThumbnailMixin', {
	teardown: function () {
		mrequire('mercury/modules/Thumbnailer').default.getThumbURL = originalThumbnailerGetThumbURL;
	}
});

test('sets aspectRatio property correctly', function () {
	var mixin = getMixin('curated-content-thumbnail');

	mixin.set('block', 'featured');
	equal(mixin.get('aspectRatio'), 16 / 9);

	mixin.set('block', 'curated');
	equal(mixin.get('aspectRatio'), 1);

	mixin.set('block', 'optional');
	equal(mixin.get('aspectRatio'), 1);
});

test('sets aspectRatioName property correctly', function () {
	var mixin = getMixin('curated-content-thumbnail');

	mixin.set('aspectRatio', 16 / 9);
	equal(mixin.get('aspectRatioName'), 'landscape');

	mixin.set('aspectRatio', 1);
	equal(mixin.get('aspectRatioName'), 'square');
});

test('sets imageHeight property correctly', function () {
	var mixin = getMixin('curated-content-thumbnail');

	mixin.setProperties({
		aspectRatio: 16 / 9,
		imageWidth: 400
	});
	equal(mixin.get('imageHeight'), 400 / (16 / 9));

	mixin.setProperties({
		aspectRatio: 1,
		imageWidth: 200
	});
	equal(mixin.get('imageHeight'), 200);
});

test('generates thumbnail URL correctly with image crop data', function () {
	var imageUrl = 'http://vignette/image.jpg',
		imageWidth = 400,
		imageCrop = {
			x: 100,
			y: 100,
			width: 1600,
			height: 900
		},
		mixin = getMixin('curated-content-thumbnail');

	mixin.setProperties({
		thumbnailer: {
			mode: {
				windowCrop: 'window-crop'
			}
		},
		cropMode: 'top-crop',
		imageWidth: imageWidth
	});

	mixin.thumbnailer.getThumbURL = function (url, options) {
		return url + '/' +
			options.mode + '/' +
			options.width + '/' +
			options.xOffset1 + '/' +
			options.yOffset1 + '/' +
			options.xOffset2 + '/' +
			options.yOffset2;
	};

	equal(
		mixin.generateThumbUrl(imageUrl, imageCrop),
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
		imageHeight = 225,
		mixin = getMixin('curated-content-thumbnail');

	mixin.setProperties({
		cropMode: 'top-crop',
		imageHeight: imageHeight,
		imageWidth: imageWidth
	});

	mixin.thumbnailer.getThumbURL = function (url, options) {
		return url + '/' + options.mode + '/' + options.width + '/' + options.height;
	};

	equal(
		mixin.generateThumbUrl(imageUrl),
		'http://vignette/image.jpg/top-crop/' + imageWidth + '/' + imageHeight
	);
});
