var mediaExample = [
	{
		image: 'Image 1'
	},
	{
		image: 'Image 2'
	}
];

moduleFor('model:media', 'MediaModel');

test('returning the media array', function () {
	var model = App.MediaModel.create({
		media: mediaExample
	});

	deepEqual(mediaExample, model.get('media'));
});

test('returning data about media', function () {
	var model = App.MediaModel.create({
		media: mediaExample
	});

	equal(mediaExample[0], model.get('media')[0]);
});
