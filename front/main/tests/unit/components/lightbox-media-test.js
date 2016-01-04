import Ember from 'ember';
import {test, moduleForComponent} from 'ember-qunit';
import mediaModel from 'main/models/media';

var model,
	track;

moduleForComponent('lightbox-media', 'Unit | Component | lightbox media', {
	unit: true,

	beforeEach: function () {
		track = require('common/utils/track').track;
		require('common/utils/track').track = Ember.K;

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
	},

	afterEach: function () {
		track = require('common/utils/track').track;
	}
});

test('sets correct footer', function (assert) {
	var componentMock = this.subject({
			model: model
		}),
		parentMock = {
			footer: null,
			setFooter: function (footer) {
				this.footer = footer;
			}
		};

	componentMock.set('targetObject', parentMock);
	// This is the analogue to setFooter='setFooter' in the parent template
	componentMock.set('setFooter', 'setFooter');

	Ember.run(function () {
		// This would normally be triggered by didInsertElement
		componentMock.notifyPropertyChange('model');

		componentMock.set('model.mediaRef', 0);
	});
	assert.equal(parentMock.footer, 'testcaption');

	Ember.run(function () {
		componentMock.set('model.mediaRef', 1);
	});
	assert.equal(parentMock.footer, 'testcaption1');
});

test('sets correct header', function (assert) {
	var componentMock = this.subject({
			model: model
		}),
		parentMock = {
			header: null,
			setHeader: function (header) {
				this.header = header;
			}
		};

	componentMock.set('targetObject', parentMock);
	// This is the analogue to setHeader='setHeader' in the parent template
	componentMock.set('setHeader', 'setHeader');

	Ember.run(function () {
		// This would normally be triggered by didInsertElement
		componentMock.notifyPropertyChange('model');

		componentMock.set('model.mediaRef', 0);
	});
	assert.equal(parentMock.header, null);

	Ember.run(function () {
		componentMock.set('model.mediaRef', 1);
	});
	assert.equal(parentMock.header, null);

	Ember.run(function () {
		componentMock.set('model.mediaRef', 2);
		componentMock.set('model.galleryRef', 0);
	});
	assert.equal(parentMock.header, '1 / 2');
});

test('checks if current media is gallery', function (assert) {
	var componentMock = this.subject({
		model: model
	});

	Ember.run(function () {
		// This would normally be triggered by didInsertElement
		componentMock.notifyPropertyChange('model');

		componentMock.set('model.mediaRef', 1);
	});
	assert.equal(componentMock.get('isGallery'), false);

	Ember.run(function () {
		componentMock.set('model.mediaRef', 2);
	});
	assert.equal(componentMock.get('isGallery'), true);
});

test('returns gallery length', function (assert) {
	var componentMock = this.subject({
		model: model
	});

	Ember.run(function () {
		// This would normally be triggered by didInsertElement
		componentMock.notifyPropertyChange('model');

		componentMock.set('model.mediaRef', 0);
	});
	assert.deepEqual(componentMock.get('galleryLength'), -1);

	Ember.run(function () {
		componentMock.set('model.mediaRef', 2);
	});
	assert.deepEqual(componentMock.get('galleryLength'), 2);
});

test('increments / decrements mediaGalleryRef within boundaries', function (assert) {
	var componentMock = this.subject({
		model: model
	});

	Ember.run(function () {
		// This would normally be triggered by didInsertElement
		componentMock.notifyPropertyChange('model');

		componentMock.setProperties({
			'model.mediaRef': 2,
			'model.galleryRef': 0
		});
	});
	assert.equal(componentMock.get('currentGalleryRef'), 0);

	Ember.run(function () {
		componentMock.nextMedia();
	});
	assert.equal(componentMock.get('currentGalleryRef'), 1);

	Ember.run(function () {
		componentMock.nextMedia();
	});
	assert.equal(componentMock.get('currentGalleryRef'), 0);

	Ember.run(function () {
		componentMock.prevMedia();
	});
	assert.equal(componentMock.get('currentGalleryRef'), 1);
});
