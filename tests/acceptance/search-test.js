import {test} from 'qunit';
import moduleForAcceptance from 'mobile-wiki/tests/helpers/module-for-acceptance';


moduleForAcceptance('Acceptance | search');

test('visiting /search', (assert) => {
	const searchInput = '.side-search__input',
		enterKeyCode = 13,
		testQuery = 'test query';

	mockFastbootService();
	visit('/');
	visit('/search');

	andThen(() => {
		assert.equal(currentURL(), '/search');
		fillIn(searchInput, testQuery);
		triggerEvent(searchInput, 'keyup', {keyCode: enterKeyCode});

		andThen(() => {
			assert.equal(currentURL(), '/search?query=test%20query');

			assert.equal(
				find('.search-results__list .wikia-card').length,
				4,
				'Correct amount of result cards is displayed'
			);

			assert.equal(
				find('.search-results__list .wikia-card__title').first().text().trim(),
				'Result 1',
				'First title is correctly displayed'
			);

			assert.equal(
				find(searchInput).val(),
				testQuery,
				'Search input still contains query'
			);

			assert.equal(
				find('.wikia-search__clear svg').length,
				true,
				'Clean query icon is visible'
			);
		});
	});
});
