import {test, moduleFor} from 'ember-qunit';

const media = [
	{
		image: 'Image 1'
	},
	{
		image: 'Image 2'
	}
];

moduleFor('model:media', 'Unit | Model | media model', {
	needs: [
		'service:logger'
	],
});

test('returning the media array', function (assert) {
	const model = this.subject({
		media
	});

	assert.deepEqual(media, model.get('media'));
});

test('returning data about media', function (assert) {
	const model = this.subject({
		media
	});

	assert.equal(media[0], model.get('media')[0]);
});
