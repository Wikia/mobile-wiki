import {test, moduleForComponent} from 'ember-qunit';

const originalMediaModel = require('main/models/media').default;

moduleForComponent('trending-videos', 'Unit | Component | trending videos', {
	unit: true,

	beforeEach() {
		require('main/models/media').default = {
			create(data) {
				return data;
			}
		};
	},

	afterEach() {
		require('main/models/media').default = originalMediaModel;
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
