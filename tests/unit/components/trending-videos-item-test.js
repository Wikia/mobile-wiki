import {test, moduleForComponent} from 'ember-qunit';
import sinon from 'sinon';
import require from 'require';

const mediaModel = require('mobile-wiki/models/media').default;
const thumbnailer = require('mobile-wiki/modules/thumbnailer').default;
let createStub;
let thumbnailerStub;

moduleForComponent('trending-videos-item', 'Unit | Component | trending videos item', {
	unit: true,
	needs: [
		'service:fastboot'
	],

	beforeEach() {
		createStub = sinon.stub(mediaModel, 'create');
		createStub.returnsArg(1);

		thumbnailerStub = sinon.stub(thumbnailer, 'getThumbURL').callsFake((url, options) => {
			return `${url}/${options.mode}/${options.width}/${options.height}`;
		});
	},

	afterEach() {
		createStub.restore();
		thumbnailerStub.restore();
	}
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

	assert.equal(componentMock.get('thumbUrl'), `http://vignette/image.jpg/top-crop/${imageWidth}/${imageHeight}`);
});


test('handles openLightbox action properly', function (assert) {
	const video = {
			title: 'pretty video'
		},
		component = this.subject();

	component.setProperties({
		onClick(data) {
			assert.deepEqual(data, {
				media: {
					media: video
				},
				mediaRef: 0
			}, 'data is not correct');
		},
		video
	});

	component.click();
});
