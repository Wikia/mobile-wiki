var mixinMock;

moduleFor('mixin:curatedContentThumbnail', 'CuratedContentThumbnailMixin', {
	setup: function () {
		mixinMock = Em.Object.createWithMixins(App.CuratedContentThumbnailMixin, {});
	}
});

test('sets aspectRatio property correctly', function () {
	mixinMock.set('block', 'curated');
	equal(mixinMock.get('aspectRatio'), 1);

	mixinMock.set('block', 'featured');
	equal(mixinMock.get('aspectRatio'), 16 / 9);

	mixinMock.set('block', 'optional');
	equal(mixinMock.get('aspectRatio'), 1);
});

test('sets aspectRatioName property correctly', function () {
	mixinMock.set('block', 'curated');
	equal(mixinMock.get('aspectRatioName'), 'square');

	mixinMock.set('block', 'featured');
	equal(mixinMock.get('aspectRatioName'), 'landscape');

	mixinMock.set('block', 'optional');
	equal(mixinMock.get('aspectRatioName'), 'square');
});

test('sets imageHeight property correctly', function () {
	mixinMock.set('aspectRatio', 1);
	mixinMock.set('imageWidth', 200);
	equal(mixinMock.get('imageHeight'), 200);

	mixinMock.set('aspectRatio', 16 / 9);
	mixinMock.set('imageWidth', 400);
	equal(mixinMock.get('imageHeight'), 400 / (16 / 9));
});
