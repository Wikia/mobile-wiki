moduleFor('controller:media-lightbox', 'Media Lightbox Controller', {
	needs: ['controller:article', 'controller:application'],
	setup: function () {
		Wikia.article.article ={
			media: [
				{
					url: 'testurl',
					caption: 'testcaption'
				},
				{
					url: 'testurl1',
					caption: 'testcaption1'
				},
				[
					{
						url: 'testgallery',
						caption: 'testgallery'
					},
				]
			]
		};
	}
});

test('init', function () {
	expect(3);
	var mediaLightboxController = this.subject(),
		articleController = mediaLightboxController.get('controllers.article');


	deepEqual(mediaLightboxController.get('model'), App.MediaModel.create());
	deepEqual(mediaLightboxController.get('file'), null);

	articleController.set('file', 'fileTitle');

	equal(mediaLightboxController.get('file'), 'fileTitle');
});

test('currentMedia', function () {
	expect(1);
	var mediaLightboxController = this.subject();

	equal(mediaLightboxController.get('currentImage'), 0);

});

test('contents', function () {
	expect(3);
	var mediaLightboxController = this.subject();

	equal(mediaLightboxController.get('contents'), '<img src="testurl">');

	mediaLightboxController.set('currentImage', 1);

	equal(mediaLightboxController.get('contents'), '<img src="testurl1">');

	mediaLightboxController.set('currentImage', 2);

	equal(mediaLightboxController.get('contents'), '<img src="testgallery">');
});

test('footer', function () {
	expect(2);
	var mediaLightboxController = this.subject();

	equal(mediaLightboxController.get('footer'), 'testcaption');

	mediaLightboxController.set('currentImage', 1);

	equal(mediaLightboxController.get('footer'), 'testcaption1');

});
//
test('galleryHeader', function () {
	expect(1);
	var mediaLightboxController = this.subject();

	mediaLightboxController.set('currentImage', 2);
	mediaLightboxController.get('currentMedia');

	equal(mediaLightboxController.get('galleryHeader'), '1 / 1');

});

test('header', function () {
	expect(3);
	var mediaLightboxController = this.subject();

	equal(mediaLightboxController.get('header'), '');

	mediaLightboxController.set('currentImage', 1);

	equal(mediaLightboxController.get('header'), '');

	mediaLightboxController.set('currentImage', 2);
	mediaLightboxController.get('currentMedia');

	equal(mediaLightboxController.get('header'), '1 / 1');
});
