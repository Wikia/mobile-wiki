/* global App, resetMercuryBaseline */
moduleFor('model:media', 'Media Model', {
	setup: function () {
		Mercury.article.article.media = [
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
		resetMercuryBaseline();
	}
});

test('returning the media array', function () {
	expect(1);

	var model = App.MediaModel.create({
		media: Mercury.article.article.media
	});

	deepEqual(Mercury.article.article.media, model.get('media'));
});

test('returning data about media', function () {
	expect(1);

	var model = App.MediaModel.create({
		media: Mercury.article.article.media
	});

	equal(Mercury.article.article.media[0], model.get('media')[0]);
});
