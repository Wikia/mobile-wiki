define('mobile-wiki/tests/unit/components/trending-videos-item-test', ['ember-qunit'], function (_emberQunit) {
	'use strict';

	(0, _emberQunit.moduleForComponent)('trending-videos-item', 'Unit | Component | trending videos item', {
		unit: true,
		needs: ['service:fastboot']
	});

	(0, _emberQunit.test)('computes thumb url properly', function (assert) {
		var imageWidth = 250,

		// 16:9 ratio
		imageHeight = 140,
		    componentMock = this.subject();

		componentMock.setProperties({
			imageWidth: imageWidth,
			mode: 'top-crop',
			video: {
				url: 'http://vignette/image.jpg'
			}
		});

		componentMock.set('thumbnailer.getThumbURL', function (url, options) {
			return url + '/' + options.mode + '/' + options.width + '/' + options.height;
		});
		assert.equal(componentMock.get('thumbUrl'), 'http://vignette/image.jpg/top-crop/' + imageWidth + '/' + imageHeight);
	});
});