import {test, moduleForComponent} from 'ember-qunit';

moduleForComponent('trending-articles-item', 'Unit | Component | trending articles item', {
	unit: true
});

test('sets proper url for the image', function (asset) {
	const imageWidth = 250,
		// 16:9 ratio
		imageHeight = 140,
		componentMock = this.subject();

	componentMock.setProperties({
		imageWidth,
		cropMode: 'top-crop',
		imageUrl: 'http://vignette/image.jpg'
	});

	componentMock.set('thumbnailer.getThumbURL', (url, options) => {
		return `${url}/${options.mode}/${options.width}/${options.height}`;
	});
	asset.equal(
		componentMock.get('currentlyRenderedImageUrl'),
		`http://vignette/image.jpg/top-crop/${imageWidth}/${imageHeight}`
	);
});

test('computes style properly', function (asset) {
	const viewportWidth = 400,
		// Viewport minus 20 and then by half
		imageWidth = 190,
		// 16:9 ratio
		imageHeight = 106,
		componentMock = this.subject();

	componentMock.updateImageSize(viewportWidth);
	asset.equal(componentMock.get('style').toString(), `width: ${imageWidth}px;`);
	asset.equal(componentMock.get('imageStyle').toString(), `height: ${imageHeight}px;`);
});
