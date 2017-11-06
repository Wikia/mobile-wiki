define('mobile-wiki/tests/unit/components/lightbox-media-test', ['sinon', 'ember-qunit', 'mobile-wiki/models/media', 'require'], function (_sinon, _emberQunit, _media, _require2) {
	'use strict';

	var trackModule = (0, _require2.default)('mobile-wiki/utils/track');

	var model = void 0,
	    trackStub = void 0;

	(0, _emberQunit.moduleForComponent)('lightbox-media', 'Unit | Component | lightbox media', {
		unit: true,
		needs: ['service:logger'],

		beforeEach: function beforeEach() {
			trackStub = _sinon.default.stub(trackModule, 'track');

			model = {
				media: _media.default.create({
					media: [{
						title: 'test',
						url: 'testurl',
						caption: 'testcaption',
						type: 'image'
					}, {
						title: 'test1',
						url: 'testurl1',
						caption: 'testcaption1',
						type: 'image'
					}, [{
						title: 'testgallery',
						url: 'testgallery',
						caption: 'testgallery',
						type: 'image'
					}, {
						title: 'testgallery1',
						url: 'testgallery1',
						caption: 'testgallery1',
						type: 'image'
					}]]
				})
			};
		},
		afterEach: function afterEach() {
			trackStub.restore();
		}
	});

	(0, _emberQunit.test)('sets correct footer', function (assert) {
		var parentMock = {
			footer: null,
			setFooter: function setFooter(footer) {
				this.footer = footer;
			}
		},
		    componentMock = this.subject();

		componentMock.setProperties({
			model: model,
			targetObject: parentMock,
			setFooter: 'setFooter'
		});

		componentMock.set('model.mediaRef', 0);
		assert.equal(parentMock.footer, 'testcaption');

		componentMock.set('model.mediaRef', 1);
		assert.equal(parentMock.footer, 'testcaption1');
	});

	(0, _emberQunit.test)('sets correct header', function (assert) {
		var parentMock = {
			header: null,
			setHeader: function setHeader(header) {
				this.header = header;
			}
		},
		    componentMock = this.subject();

		componentMock.setProperties({
			model: model,
			targetObject: parentMock,
			setHeader: 'setHeader'
		});

		componentMock.set('model.mediaRef', 0);
		assert.equal(parentMock.header, null);

		componentMock.set('model.mediaRef', 1);
		assert.equal(parentMock.header, null);

		componentMock.set('model.mediaRef', 2);
		componentMock.set('model.galleryRef', 0);
		assert.equal(parentMock.header, '1 / 2');
	});

	(0, _emberQunit.test)('checks if current media is gallery', function (assert) {
		var componentMock = this.subject();

		componentMock.set('model', model);
		componentMock.set('model.mediaRef', 1);
		assert.equal(componentMock.get('isGallery'), false);

		componentMock.set('model.mediaRef', 2);
		assert.equal(componentMock.get('isGallery'), true);
	});

	(0, _emberQunit.test)('returns gallery length', function (assert) {
		var componentMock = this.subject();

		componentMock.set('model', model);
		componentMock.set('model.mediaRef', 0);
		assert.deepEqual(componentMock.get('galleryLength'), -1);

		componentMock.set('model.mediaRef', 2);
		assert.deepEqual(componentMock.get('galleryLength'), 2);
	});

	(0, _emberQunit.test)('increments / decrements mediaGalleryRef within boundaries', function (assert) {
		var componentMock = this.subject();

		componentMock.set('model', model);
		componentMock.setProperties({
			'model.mediaRef': 2,
			'model.galleryRef': 0
		});
		assert.equal(componentMock.get('currentGalleryRef'), 0);

		componentMock.nextMedia();
		assert.equal(componentMock.get('currentGalleryRef'), 1);

		componentMock.nextMedia();
		assert.equal(componentMock.get('currentGalleryRef'), 0);

		componentMock.prevMedia();
		assert.equal(componentMock.get('currentGalleryRef'), 1);
	});
});