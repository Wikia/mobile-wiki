moduleForComponent('image-media', 'ImageMediaComponent');

test('get params for request to thumbnailer for the TALL infobox image', function () {
	var component = this.subject(),
		window = {
			innerWidth: 400
		},
		data = {
			media: {
				height: 1000,
				width: 200
			},
			expected: {
				mode: 'top-crop-down',
				height: 400,
				width: 400
			}
		};

	Ember.run(function () {
		component.set('media', data.media);

		equal(component.get('infoboxImageParams.mode'), data.expected.mode);
		equal(component.get('infoboxImageParams.height'), data.expected.height);
		equal(component.get('infoboxImageParams.width'), data.expected.width);
	});
});

test('get params for request to thumbnailer for the WIDE infobox image', function () {
	var component = this.subject(),
		data = {
			media: {
				height: 600,
				width: 1600
			},
			expected: {
				mode: 'zoom-crop',
				height: 400 * 9 / 16,
				width: 400
			}
		};

	Ember.run(function () {
		component.set('media', data.media);

		equal(component.get('infoboxImageParams.mode'), data.expected.mode);
		equal(component.get('infoboxImageParams.height'), data.expected.height);
		equal(component.get('infoboxImageParams.width'), data.expected.width);
	});
});

test('get params for request to thumbnailer for the NORMAL infobox image', function () {
	var component = this.subject(),
		data = {
			media: {
				height: 600,
				width: 1000
			},
			expected: {
				mode: 'thumbnail-down',
				height: 240,
				width: 400
			}
		};

	Ember.run(function () {
		component.set('media', data.media);

		equal(component.get('infoboxImageParams.mode'), data.expected.mode);
		equal(component.get('infoboxImageParams.height'), data.expected.height);
		equal(component.get('infoboxImageParams.width'), data.expected.width);
	});
});