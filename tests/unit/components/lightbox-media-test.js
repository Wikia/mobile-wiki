import sinon from 'sinon';
import {module, test} from 'qunit';
import {setupTest} from 'ember-qunit';
import mediaModel from 'mobile-wiki/models/media';
import require from 'require';

const trackModule = require('mobile-wiki/utils/track');

let model,
	trackStub;

module('Unit | Component | lightbox media', function (hooks) {
	setupTest(hooks);

	hooks.beforeEach(function () {
		trackStub = sinon.stub(trackModule, 'track');

		model = {
			media: mediaModel.create({
				media: [
					{
						title: 'test',
						url: 'testurl',
						caption: 'testcaption',
						type: 'image'
					},
					{
						title: 'test1',
						url: 'testurl1',
						caption: 'testcaption1',
						type: 'image'
					},
					[
						{
							title: 'testgallery',
							url: 'testgallery',
							caption: 'testgallery',
							type: 'image'
						},
						{
							title: 'testgallery1',
							url: 'testgallery1',
							caption: 'testgallery1',
							type: 'image'
						}
					]
				]
			})
		};
	});

	hooks.afterEach(function () {
		trackStub.restore();
	});

	test('sets correct footer', function (assert) {
		const parentMock = {
				footer: null,
				setFooter(footer) {
					this.footer = footer;
				}
			},
			componentMock = this.owner.factoryFor('component:lightbox-media').create();

		componentMock.setProperties({
			model,
			targetObject: parentMock,
			setFooter: parentMock.setFooter.bind(parentMock)
		});

		componentMock.set('model.mediaRef', 0);
		assert.equal(parentMock.footer, 'testcaption');

		componentMock.set('model.mediaRef', 1);
		assert.equal(parentMock.footer, 'testcaption1');
	});

	test('sets correct header', function (assert) {
		const parentMock = {
				header: null,
				setHeader(header) {
					this.header = header;
				}
			},
			componentMock = this.owner.factoryFor('component:lightbox-media').create();

		componentMock.setProperties({
			model,
			targetObject: parentMock,
			setHeader: parentMock.setHeader.bind(parentMock)
		});

		componentMock.set('model.mediaRef', 0);
		assert.equal(parentMock.header, null);

		componentMock.set('model.mediaRef', 1);
		assert.equal(parentMock.header, null);

		componentMock.set('model.mediaRef', 2);
		componentMock.set('model.galleryRef', 0);
		assert.equal(parentMock.header, '1 / 2');
	});

	test('checks if current media is gallery', function (assert) {
		const componentMock = this.owner.factoryFor('component:lightbox-media').create();

		componentMock.set('model', model);
		componentMock.set('model.mediaRef', 1);
		assert.equal(componentMock.get('isGallery'), false);

		componentMock.set('model.mediaRef', 2);
		assert.equal(componentMock.get('isGallery'), true);
	});

	test('returns gallery length', function (assert) {
		const componentMock = this.owner.factoryFor('component:lightbox-media').create();

		componentMock.set('model', model);
		componentMock.set('model.mediaRef', 0);
		assert.deepEqual(componentMock.get('galleryLength'), -1);

		componentMock.set('model.mediaRef', 2);
		assert.deepEqual(componentMock.get('galleryLength'), 2);
	});

	test('increments / decrements mediaGalleryRef within boundaries', function (assert) {
		const componentMock = this.owner.factoryFor('component:lightbox-media').create();

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
