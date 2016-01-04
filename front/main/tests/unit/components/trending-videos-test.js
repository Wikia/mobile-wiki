import {test, moduleForComponent} from 'ember-qunit';

var originalMediaModel;

moduleForComponent('trending-videos', 'Unit | Component | trending videos', {
	unit: true,

	beforeEach: function () {
		originalMediaModel = require('main/models/media').default;

		require('main/models/media').default = {
			create: function (data) {
				return data;
			}
		};
	},

	afterEach: function () {
		require('main/models/media').default = originalMediaModel;
	}
});

test('handles openLightbox action properly', function (assert) {
	var component = this.subject(),
		video = {
			title: 'pretty video'
		};

	// This is the analogue to openCuratedContentItem='openCuratedContentItem' in the parent template
	component.set('openLightbox', 'openLightbox');

	component.set('targetObject', {
		openLightbox: function (type, data) {
			assert.equal(type, 'media');

			deepEqual(data, {
				media: {
					media: video
				},
				mediaRef: 0
			}, 'data is not correct');
		}
	});
	component.send('openLightbox', video);
});
