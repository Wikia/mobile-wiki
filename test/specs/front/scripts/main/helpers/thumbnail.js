QUnit.module('main/helpers/thumbnail', function (hooks) {
	var originalThumbnailerGetThumbURL,
		thumbnailHelper;

	hooks.beforeEach(function () {
		originalThumbnailerGetThumbURL = mrequire('mercury/modules/Thumbnailer').default.getThumbURL;

		mrequire('mercury/modules/Thumbnailer').default.getThumbURL = function (url, options) {
			return url + '/' + options.mode + '/' + options.width + '/' + options.height;
		};

		thumbnailHelper = mrequire('main/helpers/thumbnail').default.compute;
	});

	hooks.afterEach(function () {
		mrequire('mercury/modules/Thumbnailer').default.getThumbURL = originalThumbnailerGetThumbURL;
	});

	QUnit.test('Thumbnail helper is exported', function () {
		ok(thumbnailHelper);
	});

	QUnit.test('generate thumbnail with default options', function () {
		var options = {};

		equal(
			thumbnailHelper(['http://wikia.com/test.jpg'], options),
			'<img src="http://wikia.com/test.jpg/fixed-aspect-ratio/100/100" alt="" class="">'
		);
	});

	QUnit.test('generate thumbnail with all options given', function () {
		var options = {
			mode: 'top-crop',
			width: 500,
			height: 300,
			alt: 'testing',
			className: 'pretty'
		};

		equal(
			thumbnailHelper(['http://wikia.com/test.jpg'], options),
			'<img src="http://wikia.com/test.jpg/top-crop/500/300" alt="testing" class="pretty">'
		);
	});

	QUnit.test('generate thumbnail with invalid mode which should be replaced by default', function () {
		var options = {
			mode: 'non-existent'
		};

		equal(
			thumbnailHelper(['http://wikia.com/test.jpg'], options),
			'<img src="http://wikia.com/test.jpg/fixed-aspect-ratio/100/100" alt="" class="">'
		);
	});

});
