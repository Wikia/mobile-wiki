define('mobile-wiki/tests/unit/components/trending-articles-item-test', ['ember-qunit'], function (_emberQunit) {
	'use strict';

	(0, _emberQunit.moduleForComponent)('trending-articles-item', 'Unit | Component | trending articles item', {
		unit: true,
		needs: ['service:fastboot']
	});

	(0, _emberQunit.test)('sets proper url for the image', function (asset) {
		var imageWidth = 250,

		// 16:9 ratio
		imageHeight = 140,
		    componentMock = this.subject();

		componentMock.setProperties({
			imageWidth: imageWidth,
			cropMode: 'top-crop',
			imageUrl: 'http://vignette/image.jpg'
		});

		componentMock.set('thumbnailer.getThumbURL', function (url, options) {
			return url + '/' + options.mode + '/' + options.width + '/' + options.height;
		});
		asset.equal(componentMock.get('currentlyRenderedImageUrl'), 'http://vignette/image.jpg/top-crop/' + imageWidth + '/' + imageHeight);
	});
});