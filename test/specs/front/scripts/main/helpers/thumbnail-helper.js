QUnit.module('Handlebars thumbnail helper', {
	setup: function () {
		sinon.stub(Mercury.Modules.Thumbnailer, 'getThumbURL', function (url, options) {
			return url + '/' + options.mode + '/' + options.width + '/' + options.height;
		});
	},
	teardown: function () {
		Mercury.Modules.Thumbnailer.getThumbURL.restore();
	}
});

QUnit.test('Thumbnail helper is registered', function () {
	ok(Em.Handlebars.helpers.thumbnail);
});

QUnit.test('generate thumbnail with default options', function () {
	var options = {
		hash: {},
		data: {isUnbound: true},
		types: []
	};

	equal(
		Em.Handlebars.helpers.thumbnail('http://wikia.com/test.jpg', options),
		'<img src="http://wikia.com/test.jpg/fixed-aspect-ratio/100/100" alt="">'
	);
});

QUnit.test('generate thumbnail with all options given', function () {
	var options = {
		hash: {
			mode: 'top-crop',
			width: 500,
			height: 300,
			alt: 'testing'
		},
		data: {isUnbound: true},
		types: [],
		hashTypes: {}
	};

	equal(
		Em.Handlebars.helpers.thumbnail('http://wikia.com/test.jpg', options),
		'<img src="http://wikia.com/test.jpg/top-crop/500/300" alt="testing">'
	);
});

QUnit.test('generate thumbnail with invalid mode which should be replaced by default', function () {
	var options = {
		hash: {
			mode: 'non-existent'
		},
		data: {isUnbound: true},
		types: [],
		hashTypes: {}
	};

	equal(
		Em.Handlebars.helpers.thumbnail('http://wikia.com/test.jpg', options),
		'<img src="http://wikia.com/test.jpg/fixed-aspect-ratio/100/100" alt="">'
	);
});
