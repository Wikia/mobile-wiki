define('mobile-wiki/tests/unit/components/trending-videos-test', ['sinon', 'require', 'ember-qunit'], function (_sinon, _require2, _emberQunit) {
	'use strict';

	var mediaModel = (0, _require2.default)('mobile-wiki/models/media').default;
	var createStub = void 0;

	(0, _emberQunit.moduleForComponent)('trending-videos', 'Unit | Component | trending videos', {
		unit: true,

		beforeEach: function beforeEach() {
			createStub = _sinon.default.stub(mediaModel, 'create');
			createStub.returnsArg(1);
		},
		afterEach: function afterEach() {
			createStub.restore();
		}
	});

	(0, _emberQunit.test)('handles openLightbox action properly', function (assert) {
		var video = {
			title: 'pretty video'
		},
		    component = this.subject();

		component.setProperties({
			openLightbox: 'openLightbox',
			targetObject: {
				openLightbox: function openLightbox(type, data) {
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
});