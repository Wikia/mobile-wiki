import {test, moduleForComponent} from 'ember-qunit';

const thumbnailerModule = require('common/modules/thumbnailer').default;
let getThumbURLStub;

moduleForComponent('infobox-image-collection', 'Unit | Component | infobox image collection', {
	unit: true,

	beforeEach() {
		getThumbURLStub = sinon.stub(thumbnailerModule, 'getThumbURL');
	},

	afterEach() {
		getThumbURLStub.restore();
	}
});

test('computedHeight TALL infobox image 200x1000', function (assert) {
	const viewportDimensions = {
			width: 400
		},
		media = {
			height: 1000,
			width: 200
		},
		expected = 400,
		component = this.subject();

	component.set('viewportDimensions', viewportDimensions);
	assert.equal(component.computedHeight(media), expected);
});

test('computedHeight WIDE infobox image 1000x200', function (assert) {
	const viewportDimensions = {
			width: 400
		},
		media = {
			height: 200,
			width: 1000
		},
		expected = 225,
		component = this.subject();

	component.set('viewportDimensions', viewportDimensions);
	assert.equal(component.computedHeight(media), expected);
});

test('computedHeight infobox image 100x100', function (assert) {
	const viewportDimensions = {
			width: 400
		},
		media = {
			height: 100,
			width: 100
		},
		expected = 100,
		component = this.subject();

	component.set('viewportDimensions', viewportDimensions);
	assert.equal(component.computedHeight(media), expected);
});
