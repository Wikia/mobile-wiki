import { module, test } from 'qunit';
import thumbnailHelper from 'mobile-wiki/helpers/thumbnail';
import thumbnailer from 'mobile-wiki/modules/thumbnailer';

module((hooks) => {
	let originalThumbnailerGetThumbURL;

	hooks.beforeEach(() => {
		originalThumbnailerGetThumbURL = thumbnailer.getThumbURL;

		thumbnailer.getThumbURL = function (url, {mode, width, height}) {
			return `${url}/${mode}/${width}/${height}`;
		};
	});

	hooks.afterEach(() => {
		thumbnailer.getThumbURL = originalThumbnailerGetThumbURL;
	});

	test('Thumbnail helper is exported', (assert) => {
		assert.ok(thumbnailHelper.compute);
	});

	test('generate thumbnail with default options', (assert) => {
		const options = {};

		assert.equal(
			thumbnailHelper.compute(['http://wikia.com/test.jpg'], options),
			'<img src="http://wikia.com/test.jpg/fixed-aspect-ratio/100/100" alt="" class="">'
		);
	});

	test('generate thumbnail with all options given', (assert) => {
		const options = {
			mode: 'top-crop',
			width: 500,
			height: 300,
			alt: 'testing',
			className: 'pretty'
		};

		assert.equal(
			thumbnailHelper.compute(['http://wikia.com/test.jpg'], options),
			'<img src="http://wikia.com/test.jpg/top-crop/500/300" alt="testing" class="pretty">'
		);
	});

	test('generate thumbnail with invalid mode which should be replaced by default', (assert) => {
		const options = {
			mode: 'non-existent'
		};

		assert.equal(
			thumbnailHelper.compute(['http://wikia.com/test.jpg'], options),
			'<img src="http://wikia.com/test.jpg/fixed-aspect-ratio/100/100" alt="" class="">'
		);
	});

}, function() {});