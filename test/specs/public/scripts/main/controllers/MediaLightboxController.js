moduleFor('controller:media-lightbox', 'Media Lightbox Controller', {
	needs: ['controller:article', 'controller:application'],
	setup: function () {
		Wikia.article.article ={
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

	equal(mediaLightboxController.get('currentMediaRef'), undefined);
});

test('contents', function () {
	expect(3);
	var mediaLightboxController = this.subject();

	mediaLightboxController.set('currentMediaRef', 0);

	equal(mediaLightboxController.get('contents'), '<img src="testurl">');

	mediaLightboxController.set('currentMediaRef', 1);

	equal(mediaLightboxController.get('contents'), '<img src="testurl1">');

	mediaLightboxController.set('currentMediaRef', 2);

	equal(mediaLightboxController.get('contents'), '<img src="testgallery">');
});

test('footer', function () {
	expect(2);
	var mediaLightboxController = this.subject();

	mediaLightboxController.set('currentMediaRef', 0);

	equal(mediaLightboxController.get('footer'), 'testcaption');

	mediaLightboxController.set('currentMediaRef', 1);

	equal(mediaLightboxController.get('footer'), 'testcaption1');

});
//
test('galleryHeader', function () {
	expect(1);
	var mediaLightboxController = this.subject();

	mediaLightboxController.set('currentMediaRef', 2);

	equal(mediaLightboxController.get('galleryHeader'), '1 / 2');

});

test('header', function () {
	expect(3);
	var mediaLightboxController = this.subject();

	equal(mediaLightboxController.get('header'), '');

	mediaLightboxController.set('currentMediaRef', 1);

	equal(mediaLightboxController.get('header'), '');

	mediaLightboxController.set('currentMediaRef', 2);

	equal(mediaLightboxController.get('header'), '1 / 2');
});

test('check if current media is gallery', function () {
	expect(2);
	var mediaLightboxController = this.subject();

	mediaLightboxController.set('currentMediaRef', 1);

	equal(mediaLightboxController.get('isGallery'), false);

	mediaLightboxController.set('currentMediaRef', 2);

	equal(mediaLightboxController.get('isGallery'), true);
});

test('returns gallery length', function () {
	expect(2);
	var mediaLightboxController = this.subject();

	mediaLightboxController.set('currentMediaRef', 0);

	deepEqual(mediaLightboxController.get('galleryLength'), false);

	mediaLightboxController.set('currentMediaRef', 2);

	deepEqual(mediaLightboxController.get('galleryLength'), 2);
});

test('increments/decrements mediaGalleryRef within boundries', function () {
	expect(4);
	var mediaLightboxController = this.subject();

	mediaLightboxController.set('currentMediaRef', 2);
	equal(mediaLightboxController.get('currentGalleryRef'), 0);

	mediaLightboxController.incrementProperty('currentGalleryRef');
	equal(mediaLightboxController.get('currentGalleryRef'), 1);

	mediaLightboxController.incrementProperty('currentGalleryRef');
	equal(mediaLightboxController.get('currentGalleryRef'), 0);

	mediaLightboxController.decrementProperty('currentGalleryRef');
	equal(mediaLightboxController.get('currentGalleryRef'), 1);
});
