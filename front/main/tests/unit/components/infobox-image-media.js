var originalThumbnailerGetThumbURL = mrequire('mercury/modules/Thumbnailer').default.getThumbURL;

moduleForComponent('infobox-image-media', 'InfoboxImageMediaComponent', {
	unit: true,

	setup: function () {
		mrequire('mercury/modules/Thumbnailer').default.getThumbURL = function (url, options) {
			return url + '/' + options.mode + '/' + options.width + '/' + options.height;
		}
	},

	teardown: function () {
		mrequire('mercury/modules/Thumbnailer').default.getThumbURL = originalThumbnailerGetThumbURL;
	}
});

test('computedHeight TALL infobox image 200x1000', function () {
	var component = this.subject(),
			viewportDimensions = {
				width: 400
			},
			media = {
				height: 1000,
				width: 200
			},
			isInfoboxHeroImage = true,
			expected = 400;

	Ember.run(function () {
		component.set('media', media);
		component.set('isInfoboxHeroImage', isInfoboxHeroImage);
		component.set('viewportDimensions', viewportDimensions);

		equal(component.get('computedHeight'), expected);
	});
});

test('computedHeight WIDE infobox image 1000x200', function () {
	var component = this.subject(),
			viewportDimensions = {
				width: 400
			},
			media = {
				height: 200,
				width: 1000
			},
			isInfoboxHeroImage = true,
			expected = 225;

	Ember.run(function () {
		component.set('media', media);
		component.set('isInfoboxHeroImage', isInfoboxHeroImage);
		component.set('viewportDimensions', viewportDimensions);

		equal(component.get('computedHeight'), expected);
	});
});

test('computedHeight infobox image 100x100', function () {
	var component = this.subject(),
			viewportDimensions = {
				width: 400
			},
			media = {
				height: 100,
				width: 100
			},
			isInfoboxHeroImage = true,
			expected = 100;

	Ember.run(function () {
		component.set('media', media);
		component.set('isInfoboxHeroImage', isInfoboxHeroImage);
		component.set('viewportDimensions', viewportDimensions);

		equal(component.get('computedHeight'), expected);
	});
});

test('get params for request to thumbnailer for the TALL infobox image', function () {
	var component = this.subject(),
		viewportDimensions = {
			width: 400
		},
		data = {
			media: {
				height: 1000,
				width: 200,
				url: 'image.com'
			},
		},
		isInfoboxHeroImage = true,
		expected = 'image.com/top-crop-down/400/400';

	Ember.run(function () {
		component.set('media', data.media);
		component.set('isInfoboxHeroImage', isInfoboxHeroImage);
		component.set('viewportDimensions', viewportDimensions);

		equal(component.get('url'), expected);
	});
});

test('get params for request to thumbnailer for the WIDE infobox image', function () {
	var component = this.subject(),
		viewportDimensions = {
			width: 400
		},
		data = {
			media: {
				height: 600,
				width: 1600,
				url: 'image.com'
			}
		},
		isInfoboxHeroImage = true,
		expected = 'image.com/zoom-crop/400/225';

	Ember.run(function () {
		component.set('media', data.media);
		component.set('isInfoboxHeroImage', isInfoboxHeroImage);
		component.set('viewportDimensions', viewportDimensions);

		equal(component.get('url'), expected);
	});
});

test('get params for request to thumbnailer for the NORMAL infobox image', function () {
	var component = this.subject(),
		viewportDimensions = {
			width: 400
		},
		data = {
			media: {
				height: 600,
				width: 1000,
				url: 'image.com'
			}
		},
		isInfoboxHeroImage = true,
		expected = 'image.com/thumbnail-down/400/240';

	Ember.run(function () {
		component.set('media', data.media);
		component.set('isInfoboxHeroImage', isInfoboxHeroImage);
		component.set('viewportDimensions', viewportDimensions);

		equal(component.get('url'), expected);
	});
});

test('get params for request to thumbnailer for the TALL infobox image outside HERO', function () {
	var component = this.subject(),
		viewportDimensions = {
			width: 400
		},
		data = {
			media: {
				height: 1000,
				width: 200,
				url: 'image.com'
			},
		},
		isInfoboxHeroImage = false,
		expected = 'image.com/top-crop-down/400/400';

	Ember.run(function () {
		component.set('media', data.media);
		component.set('isInfoboxHeroImage', isInfoboxHeroImage);
		component.set('viewportDimensions', viewportDimensions);

		equal(component.get('url'), expected);
	});
});

test('get params for request to thumbnailer for the WIDE infobox image outside HERO', function () {
	var component = this.subject(),
		viewportDimensions = {
			width: 400
		},
		data = {
			media: {
				height: 600,
				width: 1600,
				url: 'image.com'
			}
		},
		isInfoboxHeroImage = false,
		expected = 'image.com/thumbnail-down/400/150';

	Ember.run(function () {
		component.set('media', data.media);
		component.set('isInfoboxHeroImage', isInfoboxHeroImage);
		component.set('viewportDimensions', viewportDimensions);

		equal(component.get('url'), expected);
	});
});
