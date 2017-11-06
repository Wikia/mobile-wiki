define('mobile-wiki/tests/unit/helpers/thumbnail-test', ['ember-qunit', 'qunit', 'mobile-wiki/helpers/thumbnail', 'mobile-wiki/modules/thumbnailer'], function (_emberQunit, _qunit, _thumbnail, _thumbnailer) {
	'use strict';

	(0, _qunit.module)('Unit | Helper | thumbnail', function (hooks) {
		var originalThumbnailerGetThumbURL = void 0;

		hooks.beforeEach(function () {
			originalThumbnailerGetThumbURL = _thumbnailer.default.getThumbURL;

			_thumbnailer.default.getThumbURL = function (url, _ref) {
				var mode = _ref.mode,
				    width = _ref.width,
				    height = _ref.height;

				return url + '/' + mode + '/' + width + '/' + height;
			};
		});

		hooks.afterEach(function () {
			_thumbnailer.default.getThumbURL = originalThumbnailerGetThumbURL;
		});

		(0, _emberQunit.test)('Thumbnail helper is exported', function (assert) {
			assert.ok(_thumbnail.default.compute);
		});

		(0, _emberQunit.test)('generate thumbnail with default options', function (assert) {
			var options = {};

			assert.equal(_thumbnail.default.compute(['http://wikia.com/test.jpg'], options), '<img src="http://wikia.com/test.jpg/fixed-aspect-ratio/100/100" alt="" class="">');
		});

		(0, _emberQunit.test)('generate thumbnail with all options given', function (assert) {
			var options = {
				mode: 'top-crop',
				width: 500,
				height: 300,
				alt: 'testing',
				className: 'pretty'
			};

			assert.equal(_thumbnail.default.compute(['http://wikia.com/test.jpg'], options), '<img src="http://wikia.com/test.jpg/top-crop/500/300" alt="testing" class="pretty">');
		});

		(0, _emberQunit.test)('generate thumbnail with invalid mode which should be replaced by default', function (assert) {
			var options = {
				mode: 'non-existent'
			};

			assert.equal(_thumbnail.default.compute(['http://wikia.com/test.jpg'], options), '<img src="http://wikia.com/test.jpg/fixed-aspect-ratio/100/100" alt="" class="">');
		});
	});
});