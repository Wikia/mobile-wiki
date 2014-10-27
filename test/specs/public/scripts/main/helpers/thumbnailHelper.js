QUnit.module('Handlebars thumbnail helper', {
	setup: function () {
		sinon.stub(Mercury.Modules.Thumbnailer, 'getThumbURL', function (url, mode, width, height) {
			return url + '/' + mode + '/' + width + '/' + height;
		});
	},
	teardown: function () {
		Mercury.Modules.Thumbnailer.getThumbURL.restore();
	}
});

QUnit.test('Thumbnail helper is registered', function () {
	expect(1);
	ok(Em.Handlebars.helpers.thumbnail);
});

QUnit.test('generate thumbnail with default options', function () {
	expect(1);
	var options = {
		hash: {}
	};

	equal(
		Em.Handlebars.helpers.thumbnail._rawFunction('http://wikia.com/test.jpg', options),
		'<img src="http://wikia.com/test.jpg/fixed-aspect-ratio/100/100" alt="">'
	);
});

QUnit.test('generate thumbnail with all options given', function () {
	expect(1);
	var options = {
		hash: {
			mode: 'top-crop',
			width: 500,
			height: 300,
			alt: 'testing'
		}
	};

	equal(
		Em.Handlebars.helpers.thumbnail._rawFunction('http://wikia.com/test.jpg', options),
		'<img src="http://wikia.com/test.jpg/top-crop/500/300" alt="testing">'
	);
});

QUnit.test('generate thumbnail with invalid mode which should be replaced by default', function () {
	expect(1);
	var options = {
		hash: {
			mode: 'non-existent'
		}
	};

	equal(
		Em.Handlebars.helpers.thumbnail._rawFunction('http://wikia.com/test.jpg', options),
		'<img src="http://wikia.com/test.jpg/fixed-aspect-ratio/100/100" alt="">'
	);
});
