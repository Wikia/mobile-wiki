moduleFor('controller:media-lightbox', 'Media Lightbox Controller', {
	needs: ['controller:article', 'controller:application'],
	setup: function () {
		Wikia.article.article = {
			media: [
				{
					title: 'test',
					url: 'testurl',
					caption: 'testcaption'
				},
				{
					title: 'test1',
					url: 'testurl1',
					caption: 'testcaption1'
				},
				[
					{
						title: 'testgallery',
						url: 'testgallery',
						caption: 'testgallery'
					},
					{
						title: 'testgallery1',
						url: 'testgallery1',
						caption: 'testgallery1'
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
});

test('if contents is generated properly', function () {
	expect(3);
	var mediaModel = App.MediaModel.create({
			media: Wikia.article.article.media
		}),
		mediaLightboxController = this.subject({
			model: mediaModel,
			init: function () {}
		});

	mediaLightboxController.set('currentMediaRef', 0);

	equal(mediaLightboxController.get('contents'), '<img src="testurl">');

	mediaLightboxController.set('currentMediaRef', 1);

	equal(mediaLightboxController.get('contents'), '<img src="testurl1">');

	mediaLightboxController.set('currentMediaRef', 2);

	equal(mediaLightboxController.get('contents'), '<img src="testgallery">');
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

	equal(mediaLightboxController.get('galleryHeader'), '1 / 2');

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

	equal(mediaLightboxController.get('header'), '');

	mediaLightboxController.set('currentMediaRef', 1);

	equal(mediaLightboxController.get('header'), '');

	mediaLightboxController.set('currentMediaRef', 2);

	equal(mediaLightboxController.get('header'), '1 / 2');
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

	mediaLightboxController.set('currentMediaRef', 2);
	equal(mediaLightboxController.get('currentGalleryRef'), 0);

	mediaLightboxController.incrementProperty('currentGalleryRef');
	equal(mediaLightboxController.get('currentGalleryRef'), 1);

	mediaLightboxController.incrementProperty('currentGalleryRef');
	equal(mediaLightboxController.get('currentGalleryRef'), 0);

	mediaLightboxController.decrementProperty('currentGalleryRef');
	equal(mediaLightboxController.get('currentGalleryRef'), 1);
});
