import {
	find,
	findAll,
	fillIn,
	triggerKeyEvent,
	visit,
	currentURL

} from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import { module, test } from 'qunit';
import mockFastbootService from '../helpers/mock-fastboot-service';
import mockAdsService from '../helpers/mock-ads-service';

module('Acceptance | search', (hooks) => {
	setupApplicationTest(hooks);

	hooks.beforeEach(function () {
		mockFastbootService(this.owner);
		mockAdsService(this.owner);
	});

	test('visiting /search', async (assert) => {
		await visit('/search?query=test%20query');

		assert.dom('.search-results__list .wikia-card').exists({ count: 4 });
		assert.dom('.search-results__list .wikia-card__title').hasText(
			'Result 1',
			'First title is correctly displayed'
		);
	});
});
