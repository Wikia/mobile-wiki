/* global App, resetWikiaBaseline */
moduleFor('model:media', 'Media Model', {
	setup: function () {
		Wikia.article.article.media = [
			{
				image:'TEST'
			},
			{
				image:'TEST!'
			}
		];
	},
	teardown: function () {
		App.reset();
		resetWikiaBaseline();
	}
});

test('returning the media array', function () {
	expect(1);

	var model = App.MediaModel.create({
		media: Wikia.article.article.media
	});

	deepEqual(Wikia.article.article.media, model.get('media'));
});

test('returning data about media', function () {
	expect(1);

	var model = App.MediaModel.create({
		media: Wikia.article.article.media
	});

	equal(Wikia.article.article.media[0], model.get('media')[0]);
});
