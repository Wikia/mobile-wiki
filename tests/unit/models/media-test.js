import {module, test} from 'qunit';
import {setupTest} from 'ember-qunit';

import {run} from '@ember/runloop';

const media = [
	{
		image: 'Image 1'
	},
	{
		image: 'Image 2'
	}
];

module('Unit | Model | media model', (hooks) => {
	setupTest(hooks);

	test('returning the media array', function (assert) {
		const model = this.owner.factoryFor('model:media').create({media});

		assert.deepEqual(media, model.get('media'));
	});

	test('returning data about media', function (assert) {
		const model = this.owner.factoryFor('model:media').create({media});

		assert.equal(media[0], model.get('media')[0]);
	});
});
