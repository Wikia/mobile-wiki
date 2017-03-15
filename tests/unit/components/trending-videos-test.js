import sinon from 'sinon';
import {test, moduleForComponent} from 'ember-qunit';

const mediaModel = require('main/models/media').default;
let createStub;

moduleForComponent('trending-videos', 'Unit | Component | trending videos', {
	unit: true,

	beforeEach() {
		createStub = sinon.stub(mediaModel, 'create');
		createStub.returnsArg(0);
	},

	afterEach() {
		createStub.restore();
	}
});

test('handles openLightbox action properly', function (assert) {
	const video = {
			title: 'pretty video'
		},
		component = this.subject();

	component.setProperties({
		openLightbox: 'openLightbox',
		targetObject: {
			openLightbox(type, data) {
				assert.equal(type, 'media');

				assert.deepEqual(data, {
					media: {
						media: video
					},
					mediaRef: 0
				}, 'data is not correct');
			}
		}
	});

	component.send('openLightbox', video);
});
