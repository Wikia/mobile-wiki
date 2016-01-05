import {test, moduleForComponent} from 'ember-qunit';

moduleForComponent('trending-videos-item', 'Unit | Component | trending videos item', {
	unit: true
});

test('computes thumb url properly', function (assert) {
	const imageWidth = 250,
		// 16:9 ratio
		imageHeight = 140,
		componentMock = this.subject();

	componentMock.setProperties({
		imageWidth,
		mode: 'top-crop',
		video: {
			url: 'http://vignette/image.jpg'
		}
	});

	componentMock.set('thumbnailer.getThumbURL', (url, options) => {
		return `${url}/${options.mode}/${options.width}/${options.height}`;
	});
	assert.equal(componentMock.get('thumbUrl'), `http://vignette/image.jpg/top-crop/${imageWidth}/${imageHeight}`);
});

test('computes image style properly', function (assert) {
	const viewportWidth = 400,
		// Viewport width minus 10 and then calculate 16:9 ratio
		imageHeight = 219,
		componentMock = this.subject();

	componentMock.updateImageSize(viewportWidth);
	assert.equal(componentMock.get('imageStyle').toString(), `height: ${imageHeight}px;`);
});
