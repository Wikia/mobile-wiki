define('mobile-wiki/tests/acceptance/search-test', ['qunit', 'mobile-wiki/tests/helpers/module-for-acceptance'], function (_qunit, _moduleForAcceptance) {
	'use strict';

	(0, _moduleForAcceptance.default)('Acceptance | search');

	(0, _qunit.test)('visiting /search', function (assert) {
		var searchInput = '.side-search__input',
		    enterKeyCode = 13,
		    testQuery = 'test query';

		mockAdsService();
		mockFastbootService();
		visit('/');
		visit('/search');

		andThen(function () {
			assert.equal(currentURL(), '/search');
			fillIn(searchInput, testQuery);
			triggerEvent(searchInput, 'keyup', { keyCode: enterKeyCode });

			andThen(function () {
				assert.equal(currentURL(), '/search?query=test%20query');

				assert.equal(find('.search-results__list .wikia-card').length, 4, 'Correct amount of result cards is displayed');

				assert.equal(find('.search-results__list .wikia-card__title').first().text().trim(), 'Result 1', 'First title is correctly displayed');

				assert.equal(find(searchInput).val(), testQuery, 'Search input still contains query');

				assert.equal(find('.wikia-search__clear svg').length, true, 'Clean query icon is visible');
			});
		});
	});
});