define('mobile-wiki/tests/unit/models/media-test', ['ember-qunit'], function (_emberQunit) {
	'use strict';

	var media = [{
		image: 'Image 1'
	}, {
		image: 'Image 2'
	}];

	(0, _emberQunit.moduleFor)('model:media', 'Unit | Model | media model', {
		needs: ['service:logger']
	});

	(0, _emberQunit.test)('returning the media array', function (assert) {
		var model = this.subject({
			media: media
		});

		assert.deepEqual(media, model.get('media'));
	});

	(0, _emberQunit.test)('returning data about media', function (assert) {
		var model = this.subject({
			media: media
		});

		assert.equal(media[0], model.get('media')[0]);
	});
});