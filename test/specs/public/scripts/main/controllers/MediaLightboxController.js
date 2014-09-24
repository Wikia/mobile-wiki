moduleFor('controller:media-lightbox', 'Media Lightbox Controller', {
	needs: ['controller:article', 'controller:application'],
	setup: function () {
		Wikia.article.article = {
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
		};
	}
});

test('if init is run correctly and file is set', function () {
	expect(3);

	var mediaModel = App.MediaModel.create({
			media: Wikia.article.article.media
		}),
		mediaLightboxController = this.subject({
			model: mediaModel,
			init: function () {}
		}),
		articleController = mediaLightboxController.get('controllers.article');

	deepEqual(mediaLightboxController.get('model'), mediaModel);

	deepEqual(mediaLightboxController.get('file'), null);

	articleController.set('file', 'fileTitle');

	equal(mediaLightboxController.get('file'), 'fileTitle');
	articleController.set('file', null);

	mediaLightboxController.reset();
});

test('generates correct footer for a currentMedia (with caption)', function () {
	expect(2);
	var mediaModel = App.MediaModel.create({
			media: Wikia.article.article.media
		}),
		mediaLightboxController = this.subject({
			model: mediaModel,
			init: function () {}
		});

	mediaLightboxController.set('currentMediaRef', 0);

	equal(mediaLightboxController.get('footer'), 'testcaption');

	mediaLightboxController.set('currentMediaRef', 1);

	equal(mediaLightboxController.get('footer'), 'testcaption1');

	mediaLightboxController.reset();
});

test('genereates correct header for a gallery', function () {
	expect(1);
	var mediaModel = App.MediaModel.create({
			media: Wikia.article.article.media
		}),
		mediaLightboxController = this.subject({
			model: mediaModel,
			init: function () {}
		});

	mediaLightboxController.set('currentMediaRef', 2);
	mediaLightboxController.set('currentGalleryRef', 0);

	equal(mediaLightboxController.get('galleryHeader'), '1 / 2');

	mediaLightboxController.reset();
});

test('updeates a header accordingly to current media', function () {
	expect(3);
	var mediaModel = App.MediaModel.create({
			media: Wikia.article.article.media
		}),
		mediaLightboxController = this.subject({
			model: mediaModel,
			init: function () {}
		});

	mediaLightboxController.set('currentMediaRef', 0);
	equal(mediaLightboxController.get('header'), '');

	mediaLightboxController.set('currentMediaRef', 1);
	equal(mediaLightboxController.get('header'), '');

	mediaLightboxController.set('currentMediaRef', 2);
	mediaLightboxController.set('currentGalleryRef', 0);
	equal(mediaLightboxController.get('header'), '1 / 2');

	mediaLightboxController.reset();
});

test('check if current media is gallery', function () {
	expect(2);
	var mediaModel = App.MediaModel.create({
			media: Wikia.article.article.media
		}),
		mediaLightboxController = this.subject({
			model: mediaModel,
			init: function () {}
		});

	mediaLightboxController.set('currentMediaRef', 1);
	equal(mediaLightboxController.get('isGallery'), false);

	mediaLightboxController.set('currentMediaRef', 2);
	equal(mediaLightboxController.get('isGallery'), true);

	mediaLightboxController.reset();
});

test('returns gallery length, if current media is a gallery', function () {
	expect(2);
	var mediaModel = App.MediaModel.create({
			media: Wikia.article.article.media
		}),
		mediaLightboxController = this.subject({
			model: mediaModel,
			init: function () {}
		});

	mediaLightboxController.set('currentMediaRef', 0);
	deepEqual(mediaLightboxController.get('galleryLength'), -1);

	mediaLightboxController.set('currentMediaRef', 2);
	deepEqual(mediaLightboxController.get('galleryLength'), 2);

	mediaLightboxController.reset();
});

test('increments/decrements mediaGalleryRef within boundries', function () {
	expect(4);
	var mediaModel = App.MediaModel.create({
			media: Wikia.article.article.media
		}),
		mediaLightboxController = this.subject({
			model: mediaModel,
			init: function () {}
		});

	mediaLightboxController.set('data', {
		mediaRef: 2,
		galleryRef: 0
	});

	equal(mediaLightboxController.get('currentGalleryRef'), 0);

	mediaLightboxController.incrementProperty('currentGalleryRef');
	equal(mediaLightboxController.get('currentGalleryRef'), 1);

	mediaLightboxController.incrementProperty('currentGalleryRef');
	equal(mediaLightboxController.get('currentGalleryRef'), 0);

	mediaLightboxController.decrementProperty('currentGalleryRef');
	equal(mediaLightboxController.get('currentGalleryRef'), 1);

	mediaLightboxController.reset();
});
