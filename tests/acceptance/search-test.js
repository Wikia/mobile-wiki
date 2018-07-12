import {
	find,
	findAll,
	fillIn,
	triggerKeyEvent,
	visit,
	currentURL
} from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import { module, test, skip } from 'qunit';
import mockFastbootService from '../helpers/mock-fastboot-service';
import mockAdsService from '../helpers/mock-ads-service';

module('Acceptance | search', (hooks) => {
	setupApplicationTest(hooks);

	hooks.beforeEach(function () {
		mockFastbootService(this.owner);
		mockAdsService(this.owner);
	});

	skip('visiting /search', async (assert) => {
		const searchInput = '.side-search__input';
		const testQuery = 'test query';

		await visit('/search');

		assert.equal(currentURL(), '/search');

		await fillIn(searchInput, testQuery);
		await triggerKeyEvent(searchInput, 'keyup', 'Enter');

		assert.equal(currentURL(), '/search?query=test%20query');

		assert.dom('.search-results__list .wikia-card').exists({ count: 4 });
		assert.dom('.search-results__list .wikia-card__title').hasText(
			'Result 1',
			'First title is correctly displayed'
		);

		assert.dom(searchInput).hasValue(testQuery, 'Search input still contains query');
		assert.dom('.wikia-search__clear svg').exists();
	});
});
