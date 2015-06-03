var model;

moduleForComponent('lightbox-media', 'LightboxMediaComponent', {
	setup: function () {
		M.track = function () {};

		model = {
			media: App.MediaModel.create({
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
	}
});

test('sets correct footer', function () {
	var componentMock = this.subject({
		model: model
	});

	// This would normally be triggered by didInsertElement
	componentMock.notifyPropertyChange('model');

	Ember.run(function() {
		componentMock.set('model.mediaRef', 0);
	});
	equal(componentMock.get('footer'), 'testcaption');

	Ember.run(function() {
		componentMock.set('model.mediaRef', 1);
	});
	equal(componentMock.get('footer'), 'testcaption1');
});

test('sets correct header', function () {
	var componentMock = this.subject({
		model: model
	});

	// This would normally be triggered by didInsertElement
	componentMock.notifyPropertyChange('model');

	Ember.run(function() {
		componentMock.set('model.mediaRef', 0);
	});
	equal(componentMock.get('header'), null);

	Ember.run(function() {
		componentMock.set('model.mediaRef', 1);
	});
	equal(componentMock.get('header'), null);

	Ember.run(function() {
		componentMock.set('model.mediaRef', 2);
		componentMock.set('model.galleryRef', 0);
	});
	equal(componentMock.get('header'), '1 / 2');
});

test('checks if current media is gallery', function () {
	var componentMock = this.subject({
		model: model
	});

	// This would normally be triggered by didInsertElement
	componentMock.notifyPropertyChange('model');

	Ember.run(function() {
		componentMock.set('model.mediaRef', 1);
	});
	equal(componentMock.get('isGallery'), false);

	Ember.run(function() {
		componentMock.set('model.mediaRef', 2);
	});
	equal(componentMock.get('isGallery'), true);
});

test('returns gallery length', function () {
	var componentMock = this.subject({
		model: model
	});

	// This would normally be triggered by didInsertElement
	componentMock.notifyPropertyChange('model');

	Ember.run(function() {
		componentMock.set('model.mediaRef', 0);
	});
	deepEqual(componentMock.get('galleryLength'), -1);

	Ember.run(function() {
		componentMock.set('model.mediaRef', 2);
	});
	deepEqual(componentMock.get('galleryLength'), 2);
});

test('increments / decrements mediaGalleryRef within boundaries', function () {
	var componentMock = this.subject({
		model: model
	});

	// This would normally be triggered by didInsertElement
	componentMock.notifyPropertyChange('model');

	Ember.run(function() {
		componentMock.setProperties({
			'model.mediaRef': 2,
			'model.galleryRef': 0
		});
	});
	equal(componentMock.get('currentGalleryRef'), 0);

	Ember.run(function() {
		componentMock.nextMedia();
	});
	equal(componentMock.get('currentGalleryRef'), 1);

	Ember.run(function() {
		componentMock.nextMedia();
	});
	equal(componentMock.get('currentGalleryRef'), 0);

	Ember.run(function() {
		componentMock.prevMedia();
	});
	equal(componentMock.get('currentGalleryRef'), 1);
});

test('isCurrentMediaType method recognizes media', function () {
	var componentMock = this.subject({
		model: model
	});

	// This would normally be triggered by didInsertElement
	componentMock.notifyPropertyChange('model');

	Ember.run(function() {
		componentMock.set('model.mediaRef', 0);
	});
	equal(componentMock.isCurrentMediaType('image'), true);
});
