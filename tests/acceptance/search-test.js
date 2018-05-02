import {find, findAll, fillIn, triggerEvent, visit, currentURL} from '@ember/test-helpers';
import {setupApplicationTest} from 'ember-qunit';
import {module, test} from 'qunit';
import mockFastbootService from '../helpers/mock-fastboot-service';
import mockAdsService from '../helpers/mock-ads-service';

module('Acceptance | search', (hooks) => {
	setupApplicationTest(hooks);

	hooks.beforeEach(function () {
		mockFastbootService(this.owner);
		mockAdsService(this.owner);
	});

	test('visiting /search', async (assert) => {
		const searchInput = '.side-search__input',
			enterKeyCode = 13,
			testQuery = 'test query';

		await visit('/search');

		assert.equal(currentURL(), '/search');

		await fillIn(searchInput, testQuery);
		await triggerEvent(searchInput, 'keyup', {key: enterKeyCode});

		assert.equal(currentURL(), '/search?query=test%20query');

		assert.equal(
			findAll('.search-results__list .wikia-card').length,
			4,
			'Correct amount of result cards is displayed'
		);

		assert.equal(
			find('.search-results__list .wikia-card__title').textContent.trim(),
			'Result 1',
			'First title is correctly displayed'
		);

		assert.equal(
			find(searchInput).value,
			testQuery,
			'Search input still contains query'
		);

		assert.equal(
			!!find('.wikia-search__clear svg'),
			true,
			'Clean query icon is visible'
		);
	});
});
