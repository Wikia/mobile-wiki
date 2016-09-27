import {test} from 'qunit';
import moduleForAcceptance from 'main/tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | search');

test('visiting /search', (assert) => {
	const searchInput = '.side-search__input',
		enterKeyCode = 13,
		testQuery = 'test query',
		responsiveMock = Ember.Service.extend({
			isMobile: true,
			setBreakpoints: Ember.K
		});

	mockService(responsiveMock, 'responsive');

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
				find('.search-results__title').first().text().trim(),
				'Result 1',
				'First title is correctly displayed'
			);

			assert.equal(
				find(searchInput).val(),
				testQuery,
				'Search input still contains query'
			);

			assert.equal(
				find('.wikia-search__clear svg').is(':visible'),
				true,
				'Clean query icon is visible'
			);
		});
	});
});
