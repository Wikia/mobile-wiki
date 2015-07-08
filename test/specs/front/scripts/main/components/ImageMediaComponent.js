moduleForComponent('image-media', 'ImageMediaComponent');

test('get params for request to thumbnailer for the TALL infobox image', function () {
	var component = this.subject(),
		data = {
			media: {
				height: 1000,
				width: 200
			},
			articleContent: {
				width: 400
			},
			computedHeight: 1000,
			expected: {
				mode: 'top-crop',
				height: 400,
				width: 400
			}
		};

	Ember.run(function () {
		component.set('media', data.media);
		component.set('articleContent.width', data.articleContent.width);
		component.set('computedHeight', data.computedHeight);

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
			articleContent: {
				width: 400
			},
			computedHeight: 150,
			expected: {
				mode: 'zoom-crop',
				height: 400 * 9 / 16,
				width: 400
			}
		};

	Ember.run(function () {
		component.set('media', data.media);
		component.set('articleContent.width', data.articleContent.width);
		component.set('computedHeight', data.computedHeight);

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
			articleContent: {
				width: 250
			},
			computedHeight: 150,
			expected: {
				mode: 'thumbnail-down',
				height: 150,
				width: 250
			}
		};

	Ember.run(function () {
		component.set('media', data.media);
		component.set('articleContent.width', data.articleContent.width);
		component.set('computedHeight', data.computedHeight);

		equal(component.get('infoboxImageParams.mode'), data.expected.mode);
		equal(component.get('infoboxImageParams.height'), data.expected.height);
		equal(component.get('infoboxImageParams.width'), data.expected.width);
	});
});