import {find, findAll, fillIn, triggerEvent} from '@ember/test-helpers';
import {setupApplicationTest} from 'ember-qunit';
import {test} from 'qunit';

module('Acceptance | search', (hooks) => {
	setupApplicationTest(hooks);

	test('visiting /search', async (assert) => {
		const searchInput = '.side-search__input',
			enterKeyCode = 13,
			testQuery = 'test query';

		mockAdsService();
		mockFastbootService();
		await visit('/');
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
