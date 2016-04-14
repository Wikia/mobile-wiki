import {test, moduleForComponent} from 'ember-qunit';
import Thumbnailer from 'common/modules/thumbnailer';

moduleForComponent('portable-infobox-hero-image', 'Unit | Component | portable-infobox-hero-image', {
	unit: true
});

test('cropMode', function (assert) {
	const testCases = [
		{
			viewportWidth: 300,
			imageHeight: 500,
			imageWidth: 500,
			expected: Thumbnailer.mode.thumbnailDown,
			description: 'Big square image - limit height and use thumbnail-down'
		},
		{
			viewportWidth: 500,
			imageHeight: 300,
			imageWidth: 300,
			expected: Thumbnailer.mode.thumbnailDown,
			description: 'Small square image - use thumbnail-down'
		},
		{
			viewportWidth: 300,
			imageHeight: 300,
			imageWidth: 500,
			expected: Thumbnailer.mode.thumbnailDown,
			description: 'Big horizontal image - limit height and use thumbnail-down'
		},
		{
			viewportWidth: 500,
			imageHeight: 300,
			imageWidth: 400,
			expected: Thumbnailer.mode.thumbnailDown,
			description: 'Small horizontal image - use thumbnail-down'
		},
		{
			viewportWidth: 300,
			imageHeight: 50,
			imageWidth: 500,
			expected: Thumbnailer.mode.zoomCrop,
			description: 'Big wide image - limit height and use zoom-crop'
		},
		{
			viewportWidth: 500,
			imageHeight: 50,
			imageWidth: 300,
			expected: Thumbnailer.mode.zoomCrop,
			description: 'Small wide image - use zoom-crop'
		},
		{
			viewportWidth: 500,
			imageHeight: 600,
			imageWidth: 50,
			expected: Thumbnailer.mode.topCropDown,
			description: 'Tall image longer than viewport width - use top-crop-down'
		},
		{
			viewportWidth: 500,
			imageHeight: 300,
			imageWidth: 50,
			expected: Thumbnailer.mode.thumbnailDown,
			description: 'Tall image shorter than viewport width - use thumbnail-down'
		}
	];

	testCases.forEach((testCase) => {
		const component = this.subject();

		component.setProperties({
			viewportDimensions: {
				width: testCase.viewportWidth
			},
			height: testCase.imageHeight,
			width: testCase.imageWidth
		});

		assert.equal(component.get('cropMode'), testCase.expected, testCase.description);
	});
});

test('computedHeight', function (assert) {
	const testCases = [
		{
			viewportWidth: 300,
			imageHeight: 500,
			imageWidth: 500,
			expected: 300,
			description: 'Big square image - use viewport width'
		},
		{
			viewportWidth: 500,
			imageHeight: 300,
			imageWidth: 300,
			expected: 300,
			description: 'Small square image - use original height'
		},
		{
			viewportWidth: 300,
			imageHeight: 300,
			imageWidth: 500,
			expected: 180,
			description: 'Big horizontal image - limit height keeping the aspect ratio'
		},
		{
			viewportWidth: 500,
			imageHeight: 300,
			imageWidth: 400,
			expected: 300,
			description: 'Small horizontal image - use original height'
		},
		{
			viewportWidth: 300,
			imageHeight: 50,
			imageWidth: 500,
			expected: 168,
			description: 'Big wide image - limit height using 16:9 ratio'
		},
		{
			viewportWidth: 500,
			imageHeight: 50,
			imageWidth: 300,
			expected: 281,
			description: 'Small wide image - use 16:9 ratio (width will be equal to viewport width)'
		},
		{
			viewportWidth: 500,
			imageHeight: 600,
			imageWidth: 50,
			expected: 500,
			description: 'Tall image longer than viewport width - use viewport width'
		},
		{
			viewportWidth: 500,
			imageHeight: 300,
			imageWidth: 50,
			expected: 300,
			description: 'Tall image shorter than viewport width - use original height'
		}
	];

	testCases.forEach((testCase) => {
		const component = this.subject();

		component.setProperties({
			viewportDimensions: {
				width: testCase.viewportWidth
			},
			height: testCase.imageHeight,
			width: testCase.imageWidth
		});

		assert.equal(component.get('computedHeight'), testCase.expected, testCase.description);
	});
});
