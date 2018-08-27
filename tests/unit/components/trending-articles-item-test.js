import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import sinon from 'sinon';
import require from 'require';

const thumbnailer = require('mobile-wiki/modules/thumbnailer').default;
let thumbnailerStub;

module('Unit | Component | trending articles item', (hooks) => {
	setupTest(hooks);

	hooks.beforeEach(() => {
		thumbnailerStub = sinon.stub(thumbnailer, 'getThumbURL')
			.callsFake((url, options) => `${url}/${options.mode}/${options.width}/${options.height}`);
	});

	hooks.afterEach(() => {
		thumbnailerStub.restore();
	});

	test('sets proper url for the image', function (asset) {
		const imageWidth = 250;
		// 16:9 ratio
		const imageHeight = 140;
		const componentMock = this.owner.factoryFor('component:trending-articles-item').create();

		componentMock.setProperties({
			imageWidth,
			imageUrl: 'http://vignette/image.jpg',
		});

		asset.equal(
			componentMock.get('currentlyRenderedImageUrl'),
			`http://vignette/image.jpg/top-crop/${imageWidth}/${imageHeight}`,
		);
	});
});
