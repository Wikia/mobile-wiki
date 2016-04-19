import sinon from 'sinon';
import {test, moduleForComponent} from 'ember-qunit';

const thumbnailerModule = require('common/modules/thumbnailer').default;
let getThumbURLStub;

moduleForComponent('infobox-image-media', 'Unit | Component | infobox image media', {
	unit: true,

	beforeEach() {
		getThumbURLStub = sinon.stub(
			thumbnailerModule,
			'getThumbURL',
			(url, options) => `${url}/${options.mode}/${options.width}/${options.height}`
		);
	},

	afterEach() {
		getThumbURLStub.restore();
	}
});

test('computedHeight TALL infobox image 200x1000', function (assert) {
	const component = this.subject();

	component.setProperties({
		media: {
			height: 1000,
			width: 200
		},
		isInfoboxHeroImage: true,
		viewportDimensions: {
			width: 400
		}
	});

	assert.equal(component.get('computedHeight'), 400);
});

test('computedHeight WIDE infobox image 1000x200', function (assert) {
	const component = this.subject();

	component.setProperties({
		media: {
			height: 200,
			width: 1000
		},
		isInfoboxHeroImage: true,
		viewportDimensions: {
			width: 400
		}
	});

	assert.equal(component.get('computedHeight'), 225);
});

test('computedHeight infobox image 100x100', function (assert) {
	const component = this.subject();

	component.setProperties({
		media: {
			height: 100,
			width: 100
		},
		isInfoboxHeroImage: true,
		viewportDimensions: {
			width: 400
		}
	});

	assert.equal(component.get('computedHeight'), 100);
});

test('get params for request to thumbnailer for the TALL infobox image', function (assert) {
	const component = this.subject();

	component.setProperties({
		media: {
			height: 1000,
			width: 200,
			url: 'image.com'
		},
		isInfoboxHeroImage: true,
		viewportDimensions: {
			width: 400
		}
	});

	assert.equal(component.get('url'), 'image.com/top-crop-down/400/400');
});

test('get params for request to thumbnailer for the WIDE infobox image', function (assert) {
	const component = this.subject();

	component.setProperties({
		media: {
			height: 600,
			width: 1600,
			url: 'image.com'
		},
		isInfoboxHeroImage: true,
		viewportDimensions: {
			width: 400
		}
	});

	assert.equal(component.get('url'), 'image.com/zoom-crop/400/225');
});

test('get params for request to thumbnailer for the NORMAL infobox image', function (assert) {
	const component = this.subject();

	component.setProperties({
		media: {
			height: 600,
			width: 1000,
			url: 'image.com'
		},
		isInfoboxHeroImage: true,
		viewportDimensions: {
			width: 400
		}
	});

	assert.equal(component.get('url'), 'image.com/thumbnail-down/400/240');
});

test('get params for request to thumbnailer for the TALL infobox image outside HERO', function (assert) {
	const component = this.subject();

	component.setProperties({
		media: {
			height: 1000,
			width: 200,
			url: 'image.com'
		},
		isInfoboxHeroImage: false,
		viewportDimensions: {
			width: 400
		}
	});

	assert.equal(component.get('url'), 'image.com/top-crop-down/400/400');
});

test('get params for request to thumbnailer for the WIDE infobox image outside HERO', function (assert) {
	const component = this.subject();

	component.setProperties({
		media: {
			height: 600,
			width: 1600,
			url: 'image.com'
		},
		isInfoboxHeroImage: false,
		viewportDimensions: {
			width: 400
		}
	});

	assert.equal(component.get('url'), 'image.com/thumbnail-down/400/150');
});
