import sinon from 'sinon';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import trackModule from 'mobile-wiki/utils/track';

let model,
	trackStub;

module('Unit | Component | lightbox media', (hooks) => {
	setupTest(hooks);

	hooks.beforeEach(() => {
		trackStub = sinon.stub(trackModule, 'track');

		model = [
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
		];
	});

	hooks.afterEach(() => {
		trackStub.restore();
	});

	test('checks if current media is gallery', function (assert) {
		const componentMock = this.owner.factoryFor('component:lightbox-media').create();

		componentMock.set('model', model[0]);
		assert.equal(componentMock.get('isGallery'), false);

		componentMock.set('model', model[2]);
		assert.equal(componentMock.get('isGallery'), true);
	});

	test('returns gallery length', function (assert) {
		const componentMock = this.owner.factoryFor('component:lightbox-media').create();

		componentMock.set('model', model[0]);
		assert.deepEqual(componentMock.get('galleryLength'), -1);

		componentMock.set('model', model[2]);
		assert.deepEqual(componentMock.get('galleryLength'), 2);
	});

	test('increments / decrements mediaGalleryRef within boundaries', function (assert) {
		const componentMock = this.owner.factoryFor('component:lightbox-media').create();

		componentMock.set('model', model[2]);
		componentMock.setProperties({
			currentGalleryRef: 0
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
